import React from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const CryptoMiniCard = ({ symbol, data }: { symbol: string; data: { timestamp: string; price: number }[] }) => {
  const start = data[0]?.price;
  const end = data[data.length - 1]?.price;
  const isPositive = end >= start;
  const color = isPositive ? "#4ade80" : "#f87171"; // vert / rouge

  return (
    <div className="bg-white rounded-lg shadow p-3 w-48 flex-shrink-0">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-sm">{symbol}</span>
        <span className={`text-xs font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {(100 * ((end - start) / start)).toFixed(1)}%
        </span>
      </div>
      <div className="h-16 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <Area type="monotone" dataKey="price" stroke={color} fill={color} fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CryptoMiniCard;