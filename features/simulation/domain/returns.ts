export const intervals = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
  { label: "ALL", days: Infinity },
];

export function buildReturnSeries(performances: any[], selectedInterval: string, now = new Date()) {
  const filtered = performances
    .filter((perf) => {
      if (selectedInterval === "ALL") return true;
      const cutoff = new Date(now);
      const el = intervals.find((i) => i.label === selectedInterval);
      if (!el) return true;
      cutoff.setDate(cutoff.getDate() - (el.days | 7));
      return new Date(perf.timestamp) >= cutoff;
    })
    .map((perf) => ({
      date: new Date(perf.timestamp).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      value: perf.value,
    }));

  const sorted = [...filtered].sort((a, b) =>
    Math.abs(new Date(a.date).getDate() - new Date(b.date).getDate())
  );
  const first = sorted[0]?.value || 0;
  const last = sorted[sorted.length - 1]?.value || 0;
  const change = last - first;

  return { sorted, change };
}
