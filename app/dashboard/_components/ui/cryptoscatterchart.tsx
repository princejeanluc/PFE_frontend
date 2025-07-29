'use client'
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts'
import Image from 'next/image'
import { useCryptoMap } from '../../_lib/hooks/simulation'
import { Skeleton } from '@/components/ui/skeleton'
import { useMemo } from 'react'
import ClusterSummaryTable from './clustersummarytable'
import { clusterColors } from '../constants/constants'



const CustomDot = (props: any) => {
  const { cx, cy, payload } = props
  const borderColor = clusterColors[payload.cluster] || '#999'
  return (
    <foreignObject x={cx - 15} y={cy - 15} className="h-7 w-7  p-1 rounded-xl  shadow overflow-visible" style={{background:borderColor, borderStyle: "dotted", border:4}}>
        <div className='bg-white  rounded-full'>
            <Image className=''
            src={payload.image}
            alt={payload.symbol}
            width={30}
            height={30}
        />
        </div>
        <span className='mt-0.5 text-xs text-gray-500'>
          {payload.symbol.toUpperCase()}
        </span>
        
    </foreignObject>
  )
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const point = payload[0].payload
    const { return: ret, volatility } = payload[0].payload.metrics
    return (
      <div style={{
        background: '#fff', border: '1px solid #ccc', padding: 10,
        borderRadius: 8
      }}>
        <strong>{point.symbol.toUpperCase()}</strong><br />
        Rendement : {ret}%<br />
        Volatilité : {volatility}%
      </div>
    )
  }
  return null
}

export default function CryptoScatterChart() {

  const { data, isLoading, isError } = useCryptoMap()
  const points = useMemo(()=>{
    if(!data) return []
    console.log(data.points)
    return data.points
  }, [data])

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
      <ResponsiveContainer height="100%" width="100%" minHeight={300} maxHeight={500}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis type="number" dataKey="x" name="Comportement X" hide domain={['auto', 'auto']}/>
          <YAxis type="number" dataKey="y" name="Comportement Y" hide domain={['auto', 'auto']}/>
          <CartesianGrid stroke="#d3d3d3" strokeDasharray="5 5" />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={points} fill="#8884d8" shape={<CustomDot />} />
        </ScatterChart>
      </ResponsiveContainer>
      <ClusterSummaryTable points={points}></ClusterSummaryTable>
    </div>
  );
}
