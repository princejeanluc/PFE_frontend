'use client'
import React from 'react'
import { usePortfolio } from '../../_lib/hooks/simulation'
import ReturnTreeMap from './returntreemap'
import ChartReturns from './chartreturns'
import Titlebar from './titlebar'
import PortfolioPieChart from './portfoliopiechart'
import RiskIndicators from './riskindicators'
import { ActuAndTopCrypto } from './actuandtopcrypto'

function PortfolioComponent({portfolioId}:{portfolioId:number|string}) {
  const {data, error , isLoading} =  usePortfolio({id:portfolioId})
  return (isLoading ? (<div>is Loading</div>) : error ? <div>Error</div>:
    true ? <div className="grid grid-cols-1 gap-8">
    <div className="flex flex-col gap-4">
        <Titlebar title={`Portefeuille : ${data?.name}`}></Titlebar>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="flex flex-col gap-4 bg-white p-4 rounded-sm lg:col-span-2">
                <span className="text-primary font-medium">Répartition</span>
                <ReturnTreeMap></ReturnTreeMap>
            </div>
            <div className="flex flex-col gap-4 bg-white p-4 rounded-sm lg:col-span-3">
                <span className="text-primary font-medium">Rendements</span>
                <ChartReturns></ChartReturns>
            </div>
        </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="grid grid-cols-1 gap-4">
            <Titlebar title="News associées"></Titlebar>
            <ActuAndTopCrypto></ActuAndTopCrypto>
        </div>
        <div className="flex flex-col gap-4">
            <Titlebar title="Allocation"></Titlebar>
            <PortfolioPieChart></PortfolioPieChart>
        </div>
        <div className="flex flex-col gap-4">
            <Titlebar title="Indicateur de risque"></Titlebar>
            <RiskIndicators/>
        </div>
    </div>
  </div>:
  <div className="grid grid-cols-1 gap-8">
    <div className="flex flex-col gap-4">
        <Titlebar title={`Portefeuille : ${data?.name}`}></Titlebar>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="flex flex-col gap-4 bg-white p-4 rounded-sm lg:col-span-2">
                <span className="text-primary font-medium">Répartition</span>
                <ReturnTreeMap></ReturnTreeMap>
            </div>
            <div className="flex flex-col gap-4 bg-white p-4 rounded-sm lg:col-span-3">
                <span className="text-primary font-medium">Rendements</span>
                <ChartReturns></ChartReturns>
            </div>
        </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="grid grid-cols-1 gap-4">
            <Titlebar title="News associées"></Titlebar>
            <ActuAndTopCrypto></ActuAndTopCrypto>
        </div>
        <div className="flex flex-col gap-4">
            <Titlebar title="Allocation"></Titlebar>
            <PortfolioPieChart></PortfolioPieChart>
        </div>
        <div className="flex flex-col gap-4">
            <Titlebar title="Indicateur de risque"></Titlebar>
            <RiskIndicators/>
        </div>
    </div>
  </div>
)
}

export default PortfolioComponent