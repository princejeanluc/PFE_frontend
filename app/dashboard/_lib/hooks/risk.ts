import { useMutation, useQuery } from "@tanstack/react-query"
import { getRiskSimulation, OptionPriceInput, OptionPriceResponse, postOptionPrice, RiskApiResponse } from "../api/risk"

export const useRiskSimulation = (
  symbol: string,
  horizonHours: number,
  nSims: number = 200
) => {
  return useQuery<RiskApiResponse>({
    queryKey: ["risk-sim", symbol, horizonHours, nSims],
    queryFn: () => getRiskSimulation({ symbol, horizon_hours: horizonHours, n_sims: nSims }),
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  })
}

export const useOptionPricing = () =>
  useMutation<OptionPriceResponse, any, OptionPriceInput>({
    mutationFn: (payload) => postOptionPrice(payload),
  });


