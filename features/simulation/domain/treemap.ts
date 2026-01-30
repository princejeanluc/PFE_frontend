export function getColorByReturn(r: number) {
  if (r > 10) return "#52c41a";
  if (r > 0) return "#b7eb8f";
  if (r === 0) return "#d9d9d9";
  if (r > -5) return "#ffa39e";
  return "#cf1322";
}

export function getTextColorFromBg(bgColor: string) {
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 200 ? "#000" : "#fff";
}

export function getFontSize(width: number, height: number, max = 16, min = 8) {
  const base = Math.min(width / 6, height / 2.5);
  return Math.max(min, Math.min(max, base));
}

export function mapReturnsToTreemapData(
  returns: { symbol: string; cumulative_return: number }[]
) {
  return returns.map(({ symbol, cumulative_return }) => ({
    name: symbol,
    return: cumulative_return * 100,
    value: Math.abs(cumulative_return * 100),
  }));
}
