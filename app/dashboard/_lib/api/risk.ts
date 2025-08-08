import {api} from './index'

// --- Risk simulation ---
export type RiskApiResponse = {
  symbol: string
  history: { timestamps: string[]; prices: number[] }
  forecast_timestamps: string[]
  paths: number[][]             // nSims x T_future (prix simulés)
  vol: number[]                 // len = T_future
  metrics: { var_95: number; es_95: number; sharpe: number }
}

export const getRiskSimulation = async (params: {
  symbol: string
  horizon_hours: number
  n_sims?: number
}) => {
  const { symbol, horizon_hours, n_sims = 200 } = params
  const response = await api.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/risk/simulate/`,
    { params: { symbol, horizon_hours, n_sims } }
  )
  return response.data as RiskApiResponse
}

// --- Pricing Monte Carlo ---
export type OptionPriceInput = {
  symbol: string;               // "BTC"
  option_type: "call" | "put";
  strike: number;               // K
  risk_free?: number;           // ex 0.02
  horizon_hours?: number;       // soit ça ...
  current_date?: string;        // ... soit ces deux dates (ISO)
  maturity_date?: string;
  n_sims?: number;              // ≤ 2000
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

export const postOptionPrice = async (payload: OptionPriceInput) => {
  const { data } = await api.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/risk/option/price/`,
    payload
  );
  return data as OptionPriceResponse;
};