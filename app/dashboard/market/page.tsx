'use client'
import React from 'react'
import Titlebar from '../_components/ui/titlebar'
import { ChartAreaInteractive } from '../_components/ui/chartareaInteractive'
import { ActuAndTopCrypto } from '../_components/ui/actuandtopcrypto'
import MarketInfoCard from '../_components/ui/marketinfocard'
import { useMarketIndicators } from '../_lib/hooks/market'
import { Skeleton } from '@/components/ui/skeleton'
import LatestCryptoInfoComponent from '../_components/ui/latestcryptoinfo'


function page() {
  const { data, isLoading } = useMarketIndicators()
  
  return (
    <div className='p-2 grid grid-cols-1 gap-4'>
      <Titlebar title={'Marché'}/>
      <div className='grid grid-cols-2 lg:grid-cols-5 gap-2 '>
          {
          isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className="bg-gray-200 rounded-sm h-30 w-full" />
            ))
          ) : (
            data?.map((marketinfo: any, idx: number) => (
              <MarketInfoCard key={idx} marketinfo={marketinfo} />
            ))
          )
        }
      </div>
      <div className='grid lg:grid-cols-5 md:grid-cols-1 gap-4'>
        <div className='flex flex-col  lg:col-span-3 gap-4'>
          <Titlebar title={'Graphique'}/>
            <ChartAreaInteractive></ChartAreaInteractive>
        </div>
        <div className='flex flex-col lg:col-span-2  gap-4'>
          <Titlebar title={'Actualité & Classement'}/>
          <ActuAndTopCrypto></ActuAndTopCrypto>
        </div>
      </div>
      <LatestCryptoInfoComponent></LatestCryptoInfoComponent>
    </div>
  )
}

export default page