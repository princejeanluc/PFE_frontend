import { useMutation, useQuery } from "@tanstack/react-query";
import {
  applyStressScenario,
  getRiskSimulation,
  getStressScenarios,
  OptionPriceInput,
  OptionPriceResponse,
  postOptionPrice,
  RiskApiResponse,
  StressApplyPayload,
  StressApplyResponse,
} from "@/features/risk/api/risk";
import React from "react";

export const useRiskSimulation = (
  symbol?: string,
  horizonHours?: number,
  nSims: number = 200,
  options?: {
    enabled?: boolean;
    keepPreviousData?: boolean;
    staleTime?: number;
    retry?: number;
    refetchOnWindowFocus?: boolean;
  }
) => {
  const abortRef = React.useRef<AbortController | null>(null);

  const q = useQuery<RiskApiResponse>({
    queryKey: ["risk-sim", symbol, horizonHours, nSims],
    enabled: Boolean(options?.enabled && symbol && horizonHours && nSims),
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    retry: options?.retry ?? 0,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    queryFn: async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      return getRiskSimulation(
        { symbol: symbol!, horizon_hours: horizonHours!, n_sims: nSims },
        { signal: abortRef.current.signal }
      );
    },
  });

  return { ...q, cancel: () => abortRef.current?.abort() };
};

export const useOptionPricing = () => {
  const abortRef = React.useRef<AbortController | null>(null);

  const mutation = useMutation<OptionPriceResponse, any, OptionPriceInput>({
    mutationFn: async (payload) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        return await postOptionPrice(payload, { signal: controller.signal });
      } finally {
        abortRef.current = null;
      }
    },
    onError: (err: any) => {
      if (err?.code === "ERR_CANCELED" || err?.name === "AbortError") {
        return;
      }
    },
  });

  return {
    ...mutation,
    cancel: () => abortRef.current?.abort(),
  };
};

export const useStressScenarios = () =>
  useQuery({
    queryKey: ["stress-scenarios"],
    queryFn: getStressScenarios,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

export const useApplyStress = () =>
  useMutation<StressApplyResponse, any, StressApplyPayload>({
    mutationFn: applyStressScenario,
  });
