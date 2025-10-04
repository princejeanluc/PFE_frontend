'use client'
import React, { useMemo, useState } from 'react'
import {ResponsiveHeatMap} from '@nivo/heatmap'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCryptoRelations } from '../../_lib/hooks/simulation'


// Générer une matrice fictive de corrélations entre 0.3 et 1

function RelationMap() {
    const [type, setType] = useState<'spearman' | 'granger'>('spearman')
    const [period, setPeriod] = useState<'7d' | '14d' | '30d' | '60d'>('30d')
    const [lag, setLag] = useState<number>(1)
    const { data, isLoading, isError } =  useCryptoRelations(type, period , lag)
    
    const formattedData = useMemo(() => {
            if (!data) return []
            const matrix = data.matrix
            const rows = Object.keys(matrix) // [rowKey, {colKey: value, ...}]
            return rows.map((rowKey, i) => ({
            id: rowKey,
            data: rows.map((colKey, j) => ({
                x: colKey,
                y: j < i ? null : matrix[rowKey][colKey].toFixed(2),
            })),
            }))
        }, [data])
    return <div className='h-fit p-4 bg-white flex flex-col gap-2 rounded-xl'>
                <div className='flex items-center justify-between'>
                    <span className='text-md font-medium text-gray-500'>Matrice</span>
                    <div className='flex gap-0.5'>
                        {/* Type: Corrélation ou Causalité */}
                        <Select onValueChange={(v) => setType(v as 'spearman' | 'granger')}>
                            <SelectTrigger className='w-fit h-fit text-sm'>
                            <SelectValue placeholder='Corrélation' />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value='spearman'>Corrélation</SelectItem>
                            <SelectItem value='granger'>Causalité</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Période */}
                        <Select onValueChange={(v) => setPeriod(v as any)}>
                            <SelectTrigger className='w-fit h-fit text-sm'>
                            <SelectValue placeholder='30 jours' />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value='7d'>7 jours</SelectItem>
                            <SelectItem value='14d'>14 jours</SelectItem>
                            <SelectItem value='30d'>1 mois</SelectItem>
                            <SelectItem value='60d'>2 mois</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Lag (si Granger) */}
                        {type === 'granger' && (
                            <Select onValueChange={(v) => setLag(parseInt(v))}>
                            <SelectTrigger className='w-fit h-fit text-sm'>
                                <SelectValue placeholder='Lag 1' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='1'>Lag 1</SelectItem>
                                <SelectItem value='2'>Lag 2</SelectItem>
                                <SelectItem value='5'>Lag 5</SelectItem>
                                <SelectItem value='10'>Lag 10</SelectItem>
                            </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>
                <div className='h-156'>
                    {isLoading ? (
                    <div className='text-sm text-gray-400 p-4'>Chargement...</div>
                    ) : isError ? (
                    <div className='text-sm text-red-500 p-4'>Erreur lors du chargement.</div>
                    ) : (
                    <ResponsiveHeatMap
                        data={formattedData}
                        colors={{ type: 'sequential', scheme: 'cool' }}
                        margin={{ top: 42, right: 0, bottom: 30, left: 0 }}
                        borderRadius={5}
                        cellComponent='rect'
                        emptyColor='#f3f3f3'
                        labelTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
                        borderColor='#ffffff'
                        borderWidth={2}
                        enableLabels={false}
                        axisTop={{ tickRotation: -90, legend: 'Cryptos', legendOffset: 46 }}
                        legends={[
                        {
                            anchor: 'bottom',
                            translateX: 0,
                            translateY: 10,
                            length: 400,
                            thickness: 8,
                            direction: 'row',
                            tickPosition: 'after',
                            tickSize: 2,
                            tickSpacing: 10,
                            tickOverlap: false,
                            title: 'Légende',
                            titleAlign: 'middle',
                            titleOffset: 4,
                        },
                        ]}
                        animate={true}
                        motionConfig='wobbly'
                    />
                    )}
                </div>
            </div>
}

export default RelationMap