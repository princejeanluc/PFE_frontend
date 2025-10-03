'use client'
import React from 'react'
import Titlebar from '../_components/ui/titlebar'
import { ChartAreaInteractive } from '../_components/ui/chartareaInteractive'
import { ActuAndTopCrypto } from '../_components/ui/actuandtopcrypto'
import LatestCryptoInfoComponent from '../_components/ui/latestcryptoinfo'
import ListMarketInfoCard from '../_components/ui/ListMarketInfoCard'


function page() {
  
  return (
    <div className='p-4 grid grid-cols-1 gap-4'>
      <div className='flex flex-col gap-2'>
        <Titlebar title={'Métriques marché'}/>
        <ListMarketInfoCard></ListMarketInfoCard>
      </div>
      <div className='grid lg:grid-cols-5 md:grid-cols-1 gap-4'>
        <div className='flex flex-col  lg:col-span-3 gap-2'>
          <Titlebar title={'Graphique'}/>
          <ChartAreaInteractive></ChartAreaInteractive>
        </div>
        <div className='flex flex-col lg:col-span-2  gap-2'>
          <Titlebar title={'Actualité & Classement'}/>
          <ActuAndTopCrypto></ActuAndTopCrypto>
        </div>
      </div>
      <LatestCryptoInfoComponent></LatestCryptoInfoComponent>
    </div>
  )
}

export default page