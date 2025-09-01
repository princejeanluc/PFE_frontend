'use client'
import React from 'react'
import Titlebar from '../_components/ui/titlebar'
import { ChartAreaInteractive } from '../_components/ui/chartareaInteractive'
import { ActuAndTopCrypto } from '../_components/ui/actuandtopcrypto'
import LatestCryptoInfoComponent from '../_components/ui/latestcryptoinfo'
import ListMarketInfoCard from '../_components/ui/ListMarketInfoCard'


function page() {
  
  return (
    <div className='p-2 grid grid-cols-1 gap-4'>
      <Titlebar title={'Marché'}/>
      <ListMarketInfoCard></ListMarketInfoCard>
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