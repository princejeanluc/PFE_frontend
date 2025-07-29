'use client'
import React from 'react'
import { AlertCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type RiskIndicatorProps = {
  latestPerformance: {
    volatility: number | null,
    drawdown: number | null,
    sharpe_ratio: number | null,
    sortino_ratio: number | null,
    expected_shortfall: number | null,
    value_at_risk: number | null,
    information_ratio: number | null,
  }
}

const indicators = [
  { key: 'volatility', label: 'Volatilité', info: 'Mesure l’instabilité du portefeuille.' },
  { key: 'drawdown', label: 'MDD', info: 'Perte maximale depuis un sommet historique.' },
  { key: 'sharpe_ratio', label: 'Ratio de Sharpe', info: 'Rendement ajusté au risque total.' },
  { key: 'sortino_ratio', label: 'Ratio de Sortino', info: 'Rendement ajusté au risque baissier uniquement.' },
  { key: 'expected_shortfall', label: 'Expected Shortfall', info: 'Pire perte moyenne en cas de stress.' },
  { key: 'value_at_risk', label: 'VAR', info: 'Perte potentielle maximale sur une période donnée.' },
  { key: 'information_ratio', label: 'Information Ratio', info: 'Surperformance par rapport à un benchmark.' }
]

function RiskIndicators({ latestPerformance }: RiskIndicatorProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-col bg-white rounded-xl shadow h-full p-4 gap-4 text-sm">
        {indicators.map(({ key, label, info }) => {
          const value = latestPerformance?.[key as keyof RiskIndicatorProps['latestPerformance']];
          const display = value !== null && value !== undefined ? `${(value * 100).toFixed(1)}%` : 'N/A';
          const isNegative = (key === 'drawdown' || key === 'expected_shortfall' || key === 'value_at_risk') && value !== null && value < 0;

          return (
            <div key={key} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="flex gap-2 items-center text-gray-600">
                {label}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="h-4 w-4 text-gray-400 hover:text-gray-700 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">{info}</TooltipContent>
                </Tooltip>
              </span>
              <span className={`font-semibold ${isNegative ? 'text-red-600' : 'text-primary'}`}>
                {display}
              </span>
            </div>
          )
        })}
      </div>
    </TooltipProvider>
  )
}

export default RiskIndicators