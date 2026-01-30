import { api } from "@/core/http/api";

export type RiskApiResponse = {
  symbol: string;
  history: { timestamps: string[]; prices: number[] };
  forecast_timestamps: string[];
  paths: number[][];
  vol: number[];
  metrics: { var_95: number; es_95: number; sharpe: number };
};

export const getRiskSimulation = async (
  params: { symbol: string; horizon_hours: number; n_sims?: number },
  opts?: { signal?: AbortSignal }
) => {
  const { symbol, horizon_hours, n_sims = 200 } = params;
  const response = await api.get("/api/risk/simulate/", {
    params: { symbol, horizon_hours, n_sims },
    signal: opts?.signal,
  });
  return response.data as RiskApiResponse;
};

export type OptionPriceInput = {
  symbol: string;
  option_type: "call" | "put";
  strike: number;
  risk_free?: number;
  horizon_hours?: number;
  current_date?: string;
  maturity_date?: string;
  n_sims?: number;
};

export type OptionPriceResponse = {
  symbol: string;
  option_type: "call" | "put";
  strike: number;
  risk_free: number;
  horizon_hours: number;
  n_sims: number;
  price: number;
  ci95: [number, number];
  stderr: number;
  diagnostics: { model_used: string; last_price: number };
};

export const postOptionPrice = async (payload: OptionPriceInput, opts?: { signal?: AbortSignal }) => {
  const { data } = await api.post("/api/risk/option/price/", payload, {
    signal: opts?.signal,
  });
  return data as OptionPriceResponse;
};

export const getStressScenarios = async () => {
  const { data } = await api.get("/api/risk/stress/scenarios/");
  return Array.isArray(data) ? data : data?.results ?? [];
};

export type StressApplyPayload = {
  portfolio_id: number;
  scenario: { id: number } | { name?: string; type: "uniform" | "factor" | "historical"; params: any };
};

export type StressApplyResponse = {
  portfolio_id: number;
  scenario: { name: string; type: string };
  base_value: number;
  stressed_value: number;
  pnl: number;
  pnl_pct: number;
  by_asset: { symbol: string; weight: number; return: number; contribution: number }[];
};

export const applyStressScenario = async (payload: StressApplyPayload) => {
  const { data } = await api.post("/api/risk/stress/apply/", payload);
  return data as StressApplyResponse;
};

export const getPortfolioList = async () => {
  const { data } = await api.get("/api/portfolios/");
  return Array.isArray(data) ? data : data?.results ?? [];
};
