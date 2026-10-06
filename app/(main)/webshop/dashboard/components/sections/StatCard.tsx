"use client"

import { formatCurrency } from '@/app/utils/formatter'
import Card from '@/components/Card/Card'
import Loading from '@/components/Loading'
import '@/lib/chart'
import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { IStatCardProps } from '../../interface'

const StatCard: React.FC<IStatCardProps> = ({ label, data, isLoading, accentColor }) => {
    const trendData = useMemo(() => {
        if (!data?.data?.length) return null
        const arr = data.data
        const last = arr[arr.length - 1] ?? 0
        const prev = arr[arr.length - 2] ?? 0
        const pct = prev === 0 ? null : ((last - prev) / prev) * 100
        const isUp = pct === null ? null : pct >= 0
        return { pct, isUp }
    }, [data])

    const sparklineData = useMemo(() => ({
        labels: data?.label || [],
        datasets: [{
            data: data?.data || [],
            borderColor: accentColor,
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
        }]
    }), [data, accentColor])

    const sparklineOptions = useMemo(() => ({
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
            x: { display: false },
            y: { display: false },
        },
        animation: false as const,
    }), [])

    return (
        <Card>
            {isLoading ? (
                <div className='h-24 flex justify-center items-center'>
                    <Loading />
                </div>
            ) : (
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2'>
                        <span className='font-pixel text-sm text-(--core-grey-3)'>{label}</span>
                    </div>
                    <div className='flex items-end justify-between gap-2'>
                        <div>
                            <div className='font-pixel text-3xl text-(--core-white)'>
                                {formatCurrency(data?.total ?? 0)}
                            </div>
                            {trendData && trendData.pct !== null && (
                                <div className={`font-sans text-xs mt-1 ${trendData.isUp ? 'text-(--core-green-3)' : 'text-(--dungeons-red-3)'}`}>
                                    {trendData.isUp ? '▲' : '▼'} {Math.abs(trendData.pct).toFixed(1)}% vs prev
                                </div>
                            )}
                        </div>
                        <div className='w-28 h-12 shrink-0'>
                            <Line data={sparklineData} options={sparklineOptions} />
                        </div>
                    </div>
                </div>
            )}
        </Card>
    )
}

export default StatCard
