import React from 'react'
import RiskSimulatorCard from '../_components/ui/risksimulationcard'
import Titlebar from '../_components/ui/titlebar'
import OptionPricingCard from '../_components/ui/optionpricingcard'
import StressTestsCard from '../_components/ui/stresstestcard'

function page() {
  return (
    <div className='flex flex-col gap-4 py-4'>
        <div className='grid  gap-2'>
            <div className=' flex flex-col gap-2'>
                <Titlebar title='Simulation prévisionnelle'/>
                <RiskSimulatorCard/>
            </div>
            <div className=' flex flex-col gap-2'>
                <Titlebar title='Tarification des Options'/>
                <OptionPricingCard/>
            </div>
        </div>
        <div className='flex flex-col gap-2'>
            <Titlebar title='Stress test'></Titlebar>
            <StressTestsCard></StressTestsCard>
        </div>
    </div>
  )
}

export default page