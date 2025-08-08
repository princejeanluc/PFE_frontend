import React from 'react'
import RiskSimulatorCard from '../_components/ui/risksimulationcard'
import Titlebar from '../_components/ui/titlebar'
import OptionPricingCard from '../_components/ui/optionpricingcard'

function page() {
  return (
    <div className='flex flex-col gap-4'>
        <Titlebar title='Gestion de risque'/>
        <div className='grid lg:grid-cols-5 gap-4'>
            <div className='lg:col-span-3 flex flex-col gap-2'>
                <Titlebar title='Simulation prévisionnelle'/>
                <RiskSimulatorCard/>
            </div>
            <div className='lg:col-span-2 flex flex-col gap-2'>
                <Titlebar title='Tarification des Options'/>
                <OptionPricingCard/>
            </div>
        </div>
    </div>
  )
}

export default page