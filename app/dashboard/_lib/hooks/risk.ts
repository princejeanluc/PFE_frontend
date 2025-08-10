import { useMutation, useQuery } from "@tanstack/react-query"
import { applyStressScenario, getRiskSimulation, getStressScenarios, OptionPriceInput, OptionPriceResponse, postOptionPrice, RiskApiResponse, StressApplyPayload, StressApplyResponse } from "../api/risk"
import React from "react";

export const useRiskSimulation = (
  symbol?: string,
  horizonHours?: number,
  nSims: number = 200,
  options?: {
    enabled?: boolean;                // ✅ pas d'auto-run si false/undefined
    keepPreviousData?: boolean;       // garder le dernier résultat en vue
    staleTime?: number;
    retry?: number;
    refetchOnWindowFocus?: boolean;
  }
) => {
  const abortRef = React.useRef<AbortController | null>(null)

  const q = useQuery<RiskApiResponse>({
    queryKey: ["risk-sim", symbol, horizonHours, nSims],
    enabled: Boolean(options?.enabled && symbol && horizonHours && nSims),
    keepPreviousData: options?.keepPreviousData ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    retry: options?.retry ?? 0,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    queryFn: async () => {
      // annule la requête précédente si on relance
      abortRef.current?.abort()
      abortRef.current = new AbortController()
      return getRiskSimulation(
        { symbol: symbol!, horizon_hours: horizonHours!, n_sims: nSims },
        { signal: abortRef.current.signal }
      )
    },
  })

  return { ...q, cancel: () => abortRef.current?.abort() }
}

export const useOptionPricing = () => {
  const abortRef = React.useRef<AbortController | null>(null)

  const mutation = useMutation<OptionPriceResponse, any, OptionPriceInput>({
    mutationFn: async (payload) => {
      // annule la requête en cours si on relance
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      try {
        return await postOptionPrice(payload, { signal: controller.signal })
      } finally {
        // libère le controller (évite de garder des signaux morts)
        abortRef.current = null
      }
    },
    // facultatif: ne pas afficher d'erreur si c'est une annulation volontaire
    onError: (err: any, _vars, _ctx) => {
      // Axios >=1 : err.code === 'ERR_CANCELED'
      // Node DOM: err.name === 'AbortError'
      if (err?.code === 'ERR_CANCELED' || err?.name === 'AbortError') {
        // ignore: laisse l'UI tranquille
        return
      }
      // sinon: laisser ton composant afficher l'erreur
    },
  })

  return {
    ...mutation,
    cancel: () => abortRef.current?.abort(), // ✅ bouton "Annuler"
  }
}

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


