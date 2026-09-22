"use client"

import { ISummaryData } from '@/app/actions/interface'
import Card from '@/components/Card/Card'
import Loading from '@/components/Loading'
import '@/lib/chart'
import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'

interface ISummaryChartProps {
    users?: ISummaryData
    topups?: ISummaryData
    purchases?: ISummaryData
    isLoading: boolean
}

const SummaryChart: React.FC<ISummaryChartProps> = ({ users, topups, purchases, isLoading }) => {
    const chartData = useMemo(() => ({
        labels: purchases?.label || topups?.label || users?.label || [],
        datasets: [
            {
                label: 'New Users',
                data: users?.data || [],
                borderColor: '#6cc349',
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: 3,
                tension: 0.4,
            },
            {
                label: 'Topups',
                data: topups?.data || [],
                borderColor: '#36e6ff',
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: 3,
                tension: 0.4,
            },
            {
                label: 'Purchases',
                data: purchases?.data || [],
                borderColor: '#ffc42b',
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: 3,
                tension: 0.4,
            },
        ]
    }), [users, topups, purchases])

    const chartOptions = useMemo(() => ({
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
                labels: {
                    color: '#d0c5c0',
                    font: { size: 11 },
                    boxWidth: 12,
                    padding: 12,
                }
            }
        },
        scales: {
            x: {
                ticks: { color: '#6b6562', font: { size: 10 } },
                grid: { color: 'rgba(61,57,56,0.5)' },
            },
            y: {
                ticks: { color: '#6b6562', font: { size: 10 } },
                grid: { color: 'rgba(61,57,56,0.5)' },
            },
        },
    }), [])

    return (
        <Card cardTitle="Trend Overview">
            {isLoading ? (
                <div className='h-48 flex justify-center items-center'>
                    <Loading />
                </div>
            ) : (
                <Line data={chartData} options={chartOptions} />
            )}
        </Card>
    )
}

export default SummaryChart
