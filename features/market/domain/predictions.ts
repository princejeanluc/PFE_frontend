export type Pred = {
  model_name: string;
  predicted_price?: number;
  predicted_log_return?: number;
};

export function pickPred(preds: Pred[] | undefined, model: "gru" | "xgboost") {
  return preds?.find((p) => p.model_name.toLowerCase() === model);
}

export function pctFromLogRet100(lr_pct?: number | null) {
  return lr_pct == null ? null : (Math.exp(lr_pct / 100) - 1) * 100;
}

export function profitFromLogRet100(price?: number | null, lr_pct?: number | null) {
  return price == null || lr_pct == null ? null : price * (Math.exp(lr_pct / 100) - 1);
}
