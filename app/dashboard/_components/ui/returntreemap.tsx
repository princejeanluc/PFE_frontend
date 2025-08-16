'use client'
import React from 'react'
import { Treemap, ResponsiveContainer } from 'recharts'



const getColorByReturn = (r) => {
  if (r > 10) return '#52c41a';
  if (r > 0) return '#b7eb8f';
  if (r === 0) return '#d9d9d9';
  if (r > -5) return '#ffa39e';
  return '#cf1322';
};

const getTextColorFromBg = (bgColor) => {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 200 ? '#000' : '#fff';
};

const getFontSize = (width, height, max = 16, min = 8) => {
  const base = Math.min(width / 6, height / 2.5);
  return Math.max(min, Math.min(max, base));
};

const CustomNode = (props) => {
  const { x, y, width, height, name, return: r, depth } = props;
  if (depth === 0 || r === undefined) return null;

  const fillColor = getColorByReturn(r);
  const textColor = getTextColorFromBg(fillColor);
  const fontSize = getFontSize(width, height);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        ry={8}
        fill={fillColor}
        stroke="#fff"
        strokeWidth={1.5}
      />
      {width > 30 && height > 20 && (
        <>
          <text
            x={x + 6}
            y={y + fontSize + 4}
            fontSize={fontSize}
            fill={textColor}
            fontWeight={600}
          >
            {name}
          </text>
          <text
            x={x + 6}
            y={y + fontSize * 2 + 6}
            fontSize={fontSize}
            fill={textColor}
          >
            {r > 0 ? '+' : ''}{r.toFixed(1)}%
          </text>
        </>
      )}
    </g>
  );
};

const ReturnTreeMap = ({ returns }) => {
  console.log("returns",returns)
  const data = returns.map(({ symbol, cumulative_return }) => ({
    name: symbol,
    return: cumulative_return * 100,
    value: Math.abs(cumulative_return * 100),
  }));

  return (
    <div className="w-full h-[500px] bg-white rounded-xl p-4 shadow-lg">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="value"
          aspectRatio={4 / 3}
          stroke="#fff"
          content={<CustomNode />}
        />
      </ResponsiveContainer>
    </div>
  );
};

export default ReturnTreeMap;