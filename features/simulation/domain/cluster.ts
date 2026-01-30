export function clusterKey(c: number | null | undefined) {
  return c === -1 || c == null ? "Outlier" : String(c);
}

export function computeClusterStats(points: any[]) {
  const clusters: any[] = [];

  points.forEach((point: any) => {
    const cluster: number = point.cluster ?? "Non classé";
    if (!clusters[cluster]) {
      clusters[cluster] = {
        count: 0,
        sum_return: 0,
        sum_volatility: 0,
        sum_volume_change: 0,
        sum_avg_volume: 0,
      };
    }

    const m = point.metrics;
    clusters[cluster].count += 1;
    clusters[cluster].sum_return += m.return;
    clusters[cluster].sum_volatility += m.volatility;
    clusters[cluster].sum_volume_change += m.volume_change;
    clusters[cluster].sum_avg_volume += m.avg_volume;
  });

  return Object.entries(clusters).map(([cluster, data]: any) => ({
    cluster,
    count: data.count,
    avg_return: data.sum_return / data.count,
    avg_volatility: data.sum_volatility / data.count,
    avg_volume_change: data.sum_volume_change / data.count,
    avg_volume: data.sum_avg_volume / data.count,
  }));
}
