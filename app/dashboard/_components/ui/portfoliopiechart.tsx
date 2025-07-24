"use client"
import { ResponsivePie } from '@nivo/pie'

const PortfolioPieChart = () => {
  const allocationData = [
    { id: 'BTC', label: 'BTC', value: 35 },
    { id: 'ETH', label: 'ETH', value: 25 },
    { id: 'BNB', label: 'BNB', value: 15 },
    { id: 'SOL', label: 'SOL', value: 10 },
    { id: 'ADA', label: 'ADA', value: 10 },
    { id: 'USDT', label: 'USDT', value: 5 },
  ];

  return (
    <div className=' h-full w-full bg-white rounded-sm p-8 min-h-64'>
          <ResponsivePie
      data={allocationData}
      margin={{ top: 20, right: 120, bottom: 20, left: 20 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={6}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor="#000"
      colors={['#ffb347', '#87ceeb', '#ba55d3', '#ffd700', '#ff7f7f', '#98fb98']}
      arcLabel={(e) => `${e.id} (${e.value}%)`}
      legends={[
        {
          anchor: 'right',
          direction: 'column',
          translateX: 140,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: '#555',
          symbolSize: 12,
          symbolShape: 'circle',
        },
      ]}
      animate={true}
      motionConfig="wobbly"
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
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            Portofolio 1
          </text>
        ),
      ]}
    />
    </div>
  );
};

export default PortfolioPieChart;
