import { useMemo } from "react"
import { clusterColors } from "../constants/constants"




const computeClusterStats = (points:any) => {
  const clusters:any[] = []

  points.forEach((point :any) => {
    const cluster:number = point.cluster ?? "Non classé"
    if (!clusters[cluster]) {
      clusters[cluster] = {
        count: 0,
        sum_return: 0,
        sum_volatility: 0,
        sum_volume_change: 0,
        sum_avg_volume: 0,
      }
    }

    const m = point.metrics
    clusters[cluster].count += 1
    clusters[cluster].sum_return += m.return
    clusters[cluster].sum_volatility += m.volatility
    clusters[cluster].sum_volume_change += m.volume_change
    clusters[cluster].sum_avg_volume += m.avg_volume
  })

  return Object.entries(clusters).map(([cluster, data]) => ({
    cluster,
    count: data.count,
    avg_return: data.sum_return / data.count,
    avg_volatility: data.sum_volatility / data.count,
    avg_volume_change: data.sum_volume_change / data.count,
    avg_volume: data.sum_avg_volume / data.count,
  }))
}

function ClusterSummaryTable({ points}:{points:any[]}) {
  const stats = useMemo(() => computeClusterStats(points), [points])

  return (
    <div className="mt-6 h-fit">
      <h2 className="text-sm font-semibold mb-2">Statistiques par cluster</h2>
      <div className="overflow-x-auto">
        <table className="text-xs w-full border border-gray-200 rounded-sm shadow-sm bg-white">
          <thead>
            <tr className="text-left bg-gray-50 text-gray-600">
              <th className="px-3 py-2">Cluster</th>
              <th className="px-3 py-2">Nb</th>
              <th className="px-3 py-2">Rendement moyen</th>
              <th className="px-3 py-2">Volatilité moyenne</th>
              <th className="px-3 py-2">Chg Volume</th>
              <th className="px-3 py-2">Volume moyen</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((row:any) => (
              <tr key={row.cluster} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-1 font-medium text-gray-700">
                  <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: clusterColors[row.cluster] || "#999" }}></span>
                  {row.cluster}
                </td>
                <td className="px-3 py-1">{row.count}</td>
                <td className="px-3 py-1">{(row.avg_return * 100).toFixed(2)}%</td>
                <td className="px-3 py-1">{row.avg_volatility.toFixed(2)}</td>
                <td className="px-3 py-1">{row.avg_volume_change.toFixed(2)}</td>
                <td className="px-3 py-1">${(row.avg_volume / 1e6).toFixed(2)}M</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClusterSummaryTable;