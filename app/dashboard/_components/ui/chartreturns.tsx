'use client';

import { useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';


const intervals = [
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
  { label: 'ALL', days: Infinity },
];



const ChartReturns = ({ performances }: {performances:any[]}) => {
  const [selectedInterval, setSelectedInterval] = useState('3M');
  
  const now = new Date();
  const filteredData = performances
    .filter((perf) => {
      if (selectedInterval === 'ALL') return true;
      const cutoff = new Date(now);
      const el  = intervals.find(i => i.label === selectedInterval); 
      if (el === undefined)
      {throw Error("la valeur intervals est undefined")}
      cutoff.setDate(cutoff.getDate() - (el.days | 7));
      return new Date(perf.timestamp) >= cutoff;
    })
    .map((perf) => ({
      date: new Date(perf.timestamp).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric'
      }),
      value: perf.value
    }));

  const sorted = [...filteredData].sort((a, b) => Math.abs((new Date(a.date)).getDate() - (new Date(b.date)).getDate()));
  const first = sorted[0]?.value || 0;
  const last = sorted[sorted.length - 1]?.value || 0;
  const change = last - first;
  const changeColor = change >= 0 ? 'text-green-600' : 'text-red-600';
  const changeText = `${change >= 0 ? '+' : ''}${change.toFixed(2)} $`;

  return (
    <div className="w-full h-full bg-white p-4 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-primary text-lg font-semibold flex items-center gap-2">
            Évolution de la valeur
            <span className={`text-sm font-normal ${changeColor}`}>{changeText}</span>
          </h2>
          <p className="text-xs text-gray-400">Historique du portefeuille</p>
        </div>
        <div className="space-x-2">
          {intervals.map((interval) => (
            <button
              key={interval.label}
              className={`text-xs px-2 py-1 rounded ${selectedInterval === interval.label ? 'bg-purple-500 text-white' : 'text-gray-400'}`}
              onClick={() => setSelectedInterval(interval.label)}
            >
              {interval.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={sorted} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7e5bef" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#7e5bef" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" axisLine={false} tick={{ fontSize: 10 }} interval={Math.ceil(sorted.length / 6)} />
          <YAxis tickFormatter={(tick) => `$${tick.toFixed(0)}`} axisLine={false} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `$${value}`} />
          <Area type="monotone" dataKey="value" stroke="#7e5bef" fillOpacity={1} fill="url(#colorValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartReturns;
