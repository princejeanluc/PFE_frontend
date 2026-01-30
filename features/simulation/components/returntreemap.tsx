"use client";

import React from "react";
import { Treemap, ResponsiveContainer } from "recharts";
import { getColorByReturn, getFontSize, getTextColorFromBg, mapReturnsToTreemapData } from "@/features/simulation/domain/treemap";

const CustomNode = (props: any) => {
  const { x, y, width, height, name, return: r, depth } = props;
  if (depth === 0 || r === undefined) return null;

  const fillColor = getColorByReturn(r);
  const textColor = getTextColorFromBg(fillColor);
  const fontSize = getFontSize(width, height);

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={8} ry={8} fill={fillColor} stroke="#fff" strokeWidth={1.5} />
      {width > 30 && height > 20 && (
        <>
          <text x={x + 6} y={y + fontSize + 4} fontSize={fontSize} fill={textColor} fontWeight={600}>
            {name}
          </text>
          <text x={x + 6} y={y + fontSize * 2 + 6} fontSize={fontSize} fill={textColor}>
            {r > 0 ? "+" : ""}
            {r.toFixed(1)}%
          </text>
        </>
      )}
    </g>
  );
};

const ReturnTreeMap = ({ returns }: { returns: any }) => {
  const data = mapReturnsToTreemapData(returns);

  return (
    <div className="w-full h-[500px] bg-white rounded-xl p-4 shadow-lg">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap data={data} dataKey="value" aspectRatio={4 / 3} stroke="#fff" content={<CustomNode />} />
      </ResponsiveContainer>
    </div>
  );
};

export default ReturnTreeMap;
