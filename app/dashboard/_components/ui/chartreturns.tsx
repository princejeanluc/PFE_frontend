'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';


const data = [
  { date: '22 Feb 2025', BTC: 1.2, ETH: 3.2, BNB: -1.0, SOL: 6.7 },
  { date: '01 Mar 2025', BTC: 2.1, ETH: -1.2, BNB: 0.5, SOL: 5.8 },
  { date: '08 Mar 2025', BTC: 3.0, ETH: 2.4, BNB: -4.9, SOL: 4.3 },
  { date: '15 Mar 2025', BTC: 1.7, ETH: 2.1, BNB: 3.3, SOL: -2.5 },
  { date: '22 Mar 2025', BTC: 2.4, ETH: -0.8, BNB: 2.1, SOL: 6.1 },
  { date: '29 Mar 2025', BTC: 3.0, ETH: 2.5, BNB: -0.3, SOL: 1.9 },
  { date: '05 Apr 2025', BTC: 6.0, ETH: 1.4, BNB: 2.3, SOL: 0.7 },
];

const colors = {
  BTC: '#7e5bef',
  ETH: '#3b82f6',
  BNB: '#fbbf24',
  SOL: '#f97316',
};



const ChartReturns = () => {

  return (
    <div className="w-full h-full">
      <div className="flex justify-between mb-4">
        <div className="space-x-2">
          <span className="text-sm text-gray-500">Interval:</span>
          <button className="text-indigo-600 font-bold">7 days</button>
        </div>
        <div className="space-x-2">
          <button className="text-xs text-gray-400">1D</button>
          <button className="text-xs text-gray-400">7D</button>
          <button className="text-xs text-gray-400">1M</button>
          <button className="text-xs text-white bg-purple-500 rounded px-2 py-1">3M</button>
          <button className="text-xs text-gray-400">1Y</button>
          <button className="text-xs text-gray-400">ALL</button>
        </div>
      </div>
      <ResponsiveContainer className="w-fulln min-h-128" height={500}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" axisLine={false}/>
          <YAxis  tickFormatter={(tick) => `${tick.toFixed(1)}%`}  axisLine={false}/>
          <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
          <Legend />
          {Object.keys(colors).map((key) => (
            <Bar key={key} dataKey={key} fill={colors[key]} radius={[4, 4, 0, 0]}/>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartReturns;
