export function formatPct(x: number) {
  return `${(x * 100).toFixed(2)}%`;
}

export function formatNum(x: number) {
  if (x >= 1e9) return `${(x / 1e9).toFixed(2)}B`;
  if (x >= 1e6) return `${(x / 1e6).toFixed(2)}M`;
  if (x >= 1e3) return `${(x / 1e3).toFixed(2)}k`;
  return x.toFixed(2);
}
