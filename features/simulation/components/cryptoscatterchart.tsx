"use client";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Image from "next/image";
import { useCryptoMap } from "@/features/simulation/hooks/simulation";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
import ClusterSummaryTable from "./clustersummarytable";
import { clusterColors } from "@/shared/constants/constants";
import { clusterKey } from "@/features/simulation/domain/cluster";
import { formatPct, formatNum } from "@/features/simulation/domain/format";

const SvgDot = ({ cx, cy, payload }: any) => {
  const color = clusterColors[payload.cluster] || "#A0AEC0";
  const rOuter = 16;
  const rInner = 14;
  return (
    <g transform={`translate(${cx},${cy})`}>
      <circle r={rOuter} stroke={color} strokeWidth={3} fill="none" />
      <circle r={rInner} fill="#fff" />
      <image
        href={payload.image}
        x={-12}
        y={-12}
        width={24}
        height={24}
        clipPath="inset(0 round 12px)"
        preserveAspectRatio="xMidYMid slice"
      />
    </g>
  );
};

 

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  const m = p.metrics;
  return (
    <div className="rounded-xl border border-gray-200 bg-white/95 p-3 shadow">
      <div className="flex items-center gap-2">
        <Image src={p.image} alt={p.symbol} width={20} height={20} style={{ borderRadius: "50%" }} />
        <strong>{p.symbol.toUpperCase()}</strong>
        <span
          className="ml-2 text-xs px-2 py-0.5 rounded-full"
          style={{ background: (clusterColors[p.cluster] || "#CBD5E1") + "22", border: `1px solid ${clusterColors[p.cluster] || "#CBD5E1"}` }}
        >
          {p.cluster ?? "Outlier"}
        </span>
      </div>
      <div className="mt-1 text-sm text-gray-700">
        Rendement : {formatPct(m.return)}
        <br />
        Volatilité : {m.volatility.toFixed(2)}
        <br />
        Δ Volume : {formatPct(m.volume_change)}
        <br />
        Volume moy. : {formatNum(m.avg_volume)}
      </div>
    </div>
  );
};

function ClusterLegend({ points, selected, setSelected, clusterColors }: any) {
  const counts = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const p of points) {
      const k = clusterKey(p.cluster);
      acc[k] = (acc[k] || 0) + 1;
    }
    return acc;
  }, [points]);

  const toggle = (k: string) => {
    const next = new Set(selected);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    setSelected(next);
  };

  const clearAll = () => setSelected(new Set());

  return (
    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
      <button
        onClick={clearAll}
        className={`rounded-full border px-2 py-1 ${selected.size === 0 ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-300"}`}
        title="Afficher tous les clusters"
      >
        Tous
      </button>
      {Object.entries(counts).map(([k, v]) => {
        const color = clusterColors[k as any] || "#64748B";
        const active = selected.size === 0 || selected.has(k);
        return (
          <button
            key={k}
            onClick={() => toggle(k)}
            className={`rounded-full border px-2 py-1 ${active ? "bg-white" : "bg-gray-200 opacity-60"}`}
            style={{ borderColor: color, color }}
            title={`Afficher/masquer ${k}`}
          >
            {k} ({v})
          </button>
        );
      })}
    </div>
  );
}

export default function CryptoScatterChart() {
  const { data, isLoading, isError } = useCryptoMap();
  const [selectedClusters, setSelectedClusters] = useState<Set<string>>(new Set());
  const points = useMemo(() => {
    if (!data) return [];
    return data.points;
  }, [data]);

  const filteredPoints = useMemo(() => {
    if (!points?.length) return [];
    if (selectedClusters.size === 0) return points;
    return points.filter((p: any) => selectedClusters.has(clusterKey(p.cluster)));
  }, [points, selectedClusters]);

  if (isLoading || !data) {
    return (
      <div className="p-4 bg-white rounded-xl w-full h-full">
        <Skeleton className="w-full h-[300px] rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-white rounded-xl w-full h-full">
        <p className="text-red-500">Erreur lors du chargement du graphique.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl w-full h-full">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-600 px-2">
        <span className="font-medium">Projection 2D (UMAP)</span>
        <span className="hidden sm:inline">•</span>
        <span>Proximité = similarité de comportement (fenêtre récente)</span>
        <div className="ml-auto flex flex-wrap gap-2">
          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
            Features : rendement, volatilité, Δ volume, volume moyen
          </span>
          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
            Clustering : DBSCAN
          </span>
        </div>
      </div>
      <ClusterLegend points={points} selected={selectedClusters} setSelected={setSelectedClusters} clusterColors={clusterColors} />
      <ResponsiveContainer height="100%" width="100%" minHeight={300} maxHeight={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis type="number" dataKey="x" name="Comportement X" hide domain={["auto", "auto"]} />
          <YAxis type="number" dataKey="y" name="Comportement Y" hide domain={["auto", "auto"]} />
          <CartesianGrid stroke="#d3d3d3" strokeDasharray="5 5" />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={filteredPoints} fill="#8884d8" shape={<SvgDot />} isAnimationActive={points.length > 200 ? false : true} />
        </ScatterChart>
      </ResponsiveContainer>
      <ClusterSummaryTable points={points} />
    </div>
  );
}
