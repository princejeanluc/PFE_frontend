import { AlertCircle } from 'lucide-react'
import React from 'react'

function RiskIndicators() {
  return (
    <div className='flex flex-col bg-white rounded-sm shadow h-full p-4 gap-4 lg:text-xl'>
        <div className='flex justify-between bg-gray-100 p-2 rounded-sm'><span className='flex gap-2 items-center'>Volatilité <AlertCircle className='h-4'/></span><span className='font-medium text-md'>14%</span></div>
        <div className='flex justify-between bg-gray-100 p-2 rounded-sm'><span className='flex gap-2 items-center'>MDD <AlertCircle className='h-4'/></span><span className='font-medium text-md'>-23%</span></div>
        <div className='flex justify-between bg-gray-100 p-2 rounded-sm'><span className='flex gap-2 items-center'>Ratio de Sharpe <AlertCircle className='h-4'/></span><span className='font-medium text-md'>4%</span></div>
        <div className='flex justify-between bg-gray-100 p-2 rounded-sm'><span className='flex gap-2 items-center'>Ratio de Sortino <AlertCircle className='h-4'/></span><span className='font-medium text-md'>7%</span></div>
        <div className='flex justify-between bg-gray-100 p-2 rounded-sm'><span className='flex gap-2 items-center'>Expected Shortfall <AlertCircle className='h-4'/></span><span className='font-medium text-md'>8%</span></div>
        <div className='flex justify-between bg-gray-100 p-2 rounded-sm'><span className='flex gap-2 items-center'>VAR <AlertCircle className='h-4'/></span><span className='font-medium text-md'>9%</span></div>
        <div className='flex justify-between bg-gray-100 p-2 rounded-sm'><span className='flex gap-2 items-center'>Information Ratio<AlertCircle className='h-4'/></span><span className='font-medium text-md'>4%</span></div>
    </div>
  )
}

export default RiskIndicators