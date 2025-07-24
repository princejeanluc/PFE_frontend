import React from 'react'
import Titlebar from '../_components/ui/titlebar'
import RelationMap from '../_components/ui/relationmap'
import CryptoScatterChart from '../_components/ui/cryptoscatterchart'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PortefolioCard from '../_components/ui/portefoliocard'
import CreatePortfolioSheet from '../_components/ui/createportfoliosheetT'
import ListPortFolioComponent from '../_components/ui/listportfolio'

function Page() {
  return (
    <div className='flex flex-col gap-6 text-sm'>
        
        <ListPortFolioComponent></ListPortFolioComponent>
        <div className='w-full grid grid-cols-1 xl:grid-cols-2 gap-8 '>
            <div className='flex flex-col gap-4'>
                <Titlebar title='Relation'/>
                <RelationMap></RelationMap>
            </div>
            <div className='flex flex-col gap-4'>
                <Titlebar title='Cartographie du marché'></Titlebar>
                <CryptoScatterChart></CryptoScatterChart>
            </div>
        </div>
    </div>
  )
}

export default Page