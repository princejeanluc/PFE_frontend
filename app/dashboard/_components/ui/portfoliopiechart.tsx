"use client";

import { ResponsivePie } from '@nivo/pie';

const PortfolioPieChart = ({ holdings }) => {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="h-full w-full bg-white rounded-xl p-8 min-h-64 flex items-center justify-center text-gray-400">
        Aucune donnée d&apos;allocation disponible.
      </div>
    );
  }

  const allocationData = holdings.map((h) => ({
    id: h.crypto_detail.symbol.toUpperCase(),
    label: h.crypto_detail.symbol.toUpperCase(),
    value: parseFloat(h.allocation_percentage),
  }));

  return (
    <div className="h-full w-full bg-gradient-to-br from-white via-gray-50 to-white rounded-xl p-6 min-h-64 shadow-lg">
      <ResponsivePie
        data={allocationData}
        margin={{ top: 20, right: 120, bottom: 20, left: 20 }}
        innerRadius={0.6}
        padAngle={1.2}
        cornerRadius={6}
        activeOuterRadiusOffset={12}
        borderWidth={1.5}
        borderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#444"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
        colors={{ scheme: 'category10' }}
        arcLabel={(e) => `${e.id} (${e.value}%)`}
        legends={[
          {
            anchor: 'right',
            direction: 'column',
            translateX: 140,
            itemWidth: 100,
            itemHeight: 20,
            itemTextColor: '#333',
            symbolSize: 14,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000',
                  itemBackground: '#f3f4f6',
                },
              },
            ],
          },
        ]}
        animate={true}
        motionConfig="gentle"
        layers={[
          'arcs',
          'arcLabels',
          'legends',
          ({ centerX, centerY }) => (
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                fontSize: 18,
                fontWeight: 600,
                fill: '#1e293b',
              }}
            >
              Répartition
            </text>
          ),
        ]}
      />
    </div>
  );
};

export default PortfolioPieChart;