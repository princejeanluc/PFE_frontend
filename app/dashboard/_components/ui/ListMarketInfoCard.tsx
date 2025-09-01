import React from 'react'
import { useMarketIndicators } from '../../_lib/hooks/market'
import { Skeleton } from '@/components/ui/skeleton'
import MarketInfoCard from './marketinfocard'

function ListMarketInfoCard() {
    
  const { data, isLoading } = useMarketIndicators()
  return (
    <div>{
          isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className="bg-gray-200 rounded-sm h-30 w-full" />
            ))
          ) : (
            data?.map((marketinfo: any, idx: number) => (
              <MarketInfoCard key={idx} marketinfo={marketinfo} />
            ))
          )
        }</div>
  )
}

export default ListMarketInfoCard