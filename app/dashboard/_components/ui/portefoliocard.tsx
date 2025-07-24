import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArchiveRestore, ArchiveX, ArrowUp, CircleAlert, DollarSign, SquareX } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import CountUp from 'react-countup'

type portfolioType = {
  id : number;
  name : string ; 
  creation_date : string ; 
  holding_start : string ; 
  holding_end : string ; 
  initial_budget: number;
  allocation_type : string; 
  optimization_criteria : string ;
  is_active: true
  holdings : any[]
} 

function PortefolioCard({ portfolio }: { portfolio: portfolioType }) {
  return (
    <Link href={`/dashboard/simulation/${portfolio.id}`} className="block">
      <div className="bg-white rounded-xl px-6 py-4 border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-200 space-y-4 text-sm group">
        
        {/* Nom du portefeuille */}
        <h3 className="text-center font-semibold text-primary text-base group-hover:underline">
          {portfolio?.name}
        </h3>

        {/* Budget initial */}
        <div className="flex flex-col items-center space-y-1">
          <span className="text-gray-500">Investissement</span>
          <div className="text-3xl text-gray-800 font-extrabold flex items-center gap-1">
            <DollarSign className="text-green-500" strokeWidth={3} size={24} />
            <span> <CountUp end={portfolio.initial_budget} duration={1.5}  separator=" " decimals={2}  suffix=" $" /></span>
          </div>
        </div>

        {/* Dates importantes */}
        <div className="flex flex-col gap-2 text-gray-600 text-sm">
          <div className="flex justify-between items-center">
            <span className="flex gap-2 items-center">Créée</span>
            <span className="font-medium text-gray-900">
              {formatDistanceToNow(new Date(portfolio.creation_date), {
                addSuffix: true,
                locale: fr,
              })}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex gap-1 items-center"><ArchiveRestore size={16} /> Début</span>
            <span className="font-medium text-gray-900">{portfolio.holding_start}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex gap-1 items-center"><ArchiveX size={16} /> Fin</span>
            <span className="font-medium text-gray-900">{portfolio.holding_end}</span>
          </div>
        </div>

        {/* Cryptos contenues */}
        <div className="flex justify-between items-center px-2 py-1 rounded-md  hover:bg-red-50 transition-colors duration-200">
          <div className="flex -space-x-2">
            {portfolio.holdings.map((holding) => (
              <Avatar key={holding.id} className="h-7 w-7 bg-white border-4 border-white shadow-sm">
                <AvatarImage src={holding.crypto.image_url} alt={holding.crypto.name} />
                <AvatarFallback>{holding.crypto.symbol}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <SquareX className="text-red-400 group-hover:text-red-600 transition-colors duration-200" />
        </div>
      </div>
    </Link>
  )
}

export default PortefolioCard