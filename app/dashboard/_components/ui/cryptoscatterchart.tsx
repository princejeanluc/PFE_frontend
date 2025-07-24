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
//import { cryptoScatterData } from '../constants/simulation'
/*
const cryptoScatterData = [
  { id: "BTC", x: 30, y: 70,cluster:0, logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400", return: 12.4, volatility: 18.6 },
  { id: "ETH", x: -52, y: 65,cluster:1, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 9.3, volatility: 22.1 },
  { id: "BNB", x: 60, y: 75,cluster:0, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 7.8, volatility: 15.2 },
  { id: "SOL", x: -28, y: 58,cluster:0, logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400", return: 14.7, volatility: 27.3 },
  { id: "ADA", x: 22, y: 80,cluster:1, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 5.1, volatility: 19.4 },
  { id: "XRP", x: 35, y: 40,cluster:2, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 3.9, volatility: 11.6 },
  { id: "DOT", x: 40, y: 20,cluster:0, logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400", return: 6.7, volatility: 17.2 },
  { id: "AVAX", x: 5, y: 32,cluster:3, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 8.9, volatility: 21.7 },
  { id: "MATIC", x: 28, y: 25,cluster:0, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 4.5, volatility: 13.3 },
  { id: "TRX", x: 70, y: -65,cluster:4, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 2.6, volatility: 10.9 },
  { id: "LTC", x: 67, y: 48,cluster:2, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 3.2, volatility: 12.2 },
  { id: "ATOM", x: -50, y: 60,cluster:4, logo: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400", return: 4.7, volatility: 14.5 },
  { id: "LINK", x: 20, y: 30,cluster:0, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 5.6, volatility: 16.9 },
  { id: "NEAR", x: 55, y: 78,cluster:2, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 7.1, volatility: 23.2 },
  { id: "XTZ", x: 18, y: -60,cluster:0, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 1.9, volatility: 9.8 },
  { id: "EGLD", x: 48, y: 46,cluster:0, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 6.0, volatility: 18.1 },
  { id: "ALGO", x: 63, y: 28,cluster:1, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 2.4, volatility: 13.7 },
  { id: "AAVE", x: 75, y: -34,cluster:0, logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 10.2, volatility: 25.6 },
  { id: "UNI", x: -33, y: 50, cluster:2,logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 6.8, volatility: 20.3 },
  { id: "USDT", x: 10, y: 10, cluster:0,logo: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661", return: 0.0, volatility: 0.5 },
]//  id => symbol*/
const clusterColors: Record<number, string> = {
  0: '#ff4d4f', // rouge
  1: '#40a9ff', // bleu
  2: '#73d13d', // vert
  3: '#faad14', // orange
  4: '#9254de', // violet
}

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
      <ResponsiveContainer height="100%" width="100%" minHeight={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis type="number" dataKey="x" name="Comportement X" hide domain={['auto', 'auto']}/>
          <YAxis type="number" dataKey="y" name="Comportement Y" hide domain={['auto', 'auto']}/>
          <CartesianGrid stroke="#d3d3d3" strokeDasharray="5 5" />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={points} fill="#8884d8" shape={<CustomDot />} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
