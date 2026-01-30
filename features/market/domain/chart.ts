export type HistoryPoint = { timestamp: string; price: number };

export type ChartPoint = { date: string; price: number };

export type CryptoListItem = {
  id: string;
  symbol: string;
  name: string;
  slug?: string;
  image_url?: string;
};

export function mapHistoryToChartData(history: HistoryPoint[] | undefined): ChartPoint[] {
  if (!history?.length) return [];
  return history.map((item) => ({
    date: item.timestamp,
    price: item.price,
  }));
}

export function computePriceStats(points: ChartPoint[]) {
  if (!points.length) return null;
  const prices = points.map((d) => Number(d.price));
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

export function filterCryptoOptions(list: { results?: CryptoListItem[] } | undefined, query: string) {
  if (!list?.results) return [];
  const q = query.trim().toLowerCase();
  return list.results.filter(
    (c) => !q || c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
  );
}

export function formatTickByRange(value: string, timeRange: string) {
  const d = new Date(value);
  if (timeRange === "1d") return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
