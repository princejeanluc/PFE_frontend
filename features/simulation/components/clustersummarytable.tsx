import { useMemo } from "react";
import { clusterColors } from "@/shared/constants/constants";
import { computeClusterStats } from "@/features/simulation/domain/cluster";

function ClusterSummaryTable({ points }: { points: any[] }) {
  const stats = useMemo(() => computeClusterStats(points), [points]);

  return (
    <div className="mt-6 h-fit">
      <h2 className="text-xs font-semibold mb-2">Statistiques par cluster</h2>
      <div className="overflow-x-auto">
        <table className="text-xs w-full shadow-md shadow-amber-400">
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
            {stats.map((row: any) => (
              <tr key={row.cluster} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-1 font-medium text-gray-700">
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: clusterColors[row.cluster] || "#999" }}
                  />
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
  );
}

export default ClusterSummaryTable;
