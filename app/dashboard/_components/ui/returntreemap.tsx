'use client'
import React from 'react'
import { Treemap, ResponsiveContainer } from 'recharts'

export const data =[
    { name: "BTC", return: 12.4, value : Math.abs(12.4) },
    { name: "ETH", return: 8.9 , value : Math.abs(8.9)},
    { name: "BNB", return: -4.1 , value : Math.abs(-4.1)},
    { name: "SOL", return: 15.2 , value : Math.abs(15.2)},
    { name: "ADA", return: -7.8 , value : Math.abs(-7.8)},
    { name: "XRP", return: 2.3 , value : Math.abs(2.3)},
    { name: "AVAX", return: -1.2 , value : Math.abs(-1.2)},
    { name: "MATIC", return: 5.6 , value : Math.abs(5.6)},
    { name: "DOT", return: -3.9 , value : Math.abs(-3.9)},
    { name: "TRX", return: 0.8 , value : Math.abs(0.8)},
    { name: "LTC", return: -6.4 , value : Math.abs(-6.4 )},
    { name: "NEAR", return: 10.3 , value : Math.abs(10.3)},
    { name: "LINK", return: -2.5 , value : Math.abs(-2.5)},
    { name: "UNI", return: 3.7 , value : Math.abs(3.7)},
    { name: "AAVE", return: 6.5 , value : Math.abs( 6.5)},
    { name: "ATOM", return: -1.1 , value : Math.abs(-1.1)},
    { name: "XTZ", return: 1.9 , value : Math.abs(1.9)},
    { name: "USDT", return: 0 , value : Math.abs(1)}]


const getColorByReturn = (r: number) => {
  if (r > 10) return '#52c41a'     // vert foncé
  if (r > 0) return '#b7eb8f'       // vert clair
  if (r === 0) return '#d9d9d9'     // gris neutre
  if (r > -5) return '#ffa39e'      // rouge clair
  return '#cf1322'                 // rouge foncé
}


const getTextColorFromBg = (bgColor: string): string => {
  // Enlever le `#` si présent
  const hex = bgColor.replace('#', '');

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Formule de luminance relative perceptuelle
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  // Seuil de lisibilité
  return luminance > 140 ? '#000' : '#fff';
};

const getFontSize = (width: number, height: number, max = 16, min = 8) => {
  const base = Math.min(width / 6, height / 2.5);
  return Math.max(min, Math.min(max, base));
};

const CustomNode = (props: any) => {
  const { x, y, width, height, name, return: r, depth } = props;

  if (depth === 0 || r === undefined) return null;

  const fillColor = getColorByReturn(r);
  const textColor = getTextColorFromBg(fillColor);
  const fontSize = getFontSize(width, height); // ← calcul automatique

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
        strokeWidth={1}
      />
      {width > 30 && height > 20 && (
        <>
          <text x={x + 6} y={y + fontSize + 4} fontSize={fontSize} fill={textColor}>
            {name}
          </text>
          <text x={x + 6} y={y + fontSize * 2 + 6} fontSize={fontSize} fill={textColor}>
            {r > 0 ? '+' : ''}{r.toFixed(1)}%
          </text>
        </>
      )}
    </g>
  );
};


function ReturnTreeMap() {
  return (
    <div>
        <ResponsiveContainer width="100%" height={500}>
        <Treemap
            data={data}
            aspectRatio={4 / 3}
            content={<CustomNode/>}
        />
        </ResponsiveContainer>

    </div>
  )
}

export default ReturnTreeMap