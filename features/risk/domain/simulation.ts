export type PriceRow = {
  time: string;
  hist?: number;
  lower?: number;
  range?: number;
  median?: number;
} & {
  [k: `sim${number}`]: number;
};

export function quantile(arr: number[], q: number) {
  if (!arr.length) return NaN;
  const a = [...arr].sort((x, y) => x - y);
  const pos = (a.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return a[base + 1] !== undefined ? a[base] + rest * (a[base + 1] - a[base]) : a[base];
}

export function buildPriceRows(data: any, sampleSims = 8): PriceRow[] {
  const rows: PriceRow[] = [];
  for (let i = 0; i < (data.history?.timestamps?.length ?? 0); i++) {
    rows.push({ time: data.history.timestamps[i], hist: data.history.prices[i] });
  }
  const nSims = data.paths?.length ?? 0;
  const show = Math.min(sampleSims, nSims);
  for (let t = 0; t < (data.forecast_timestamps?.length ?? 0); t++) {
    const col = Array.from({ length: nSims }, (_, s) => data.paths[s][t]);
    const lower = quantile(col, 0.05);
    const upper = quantile(col, 0.95);
    const median = quantile(col, 0.5);
    const row: any = { time: data.forecast_timestamps[t], lower, range: upper - lower, median };
    for (let s = 0; s < show; s++) row[`sim${s}`] = data.paths[s][t];
    rows.push(row);
  }
  return rows;
}

export function buildVolRows(data: any) {
  return (data.forecast_timestamps ?? []).map((time: string, i: number) => ({
    time,
    vol: data.vol?.[i],
  }));
}
