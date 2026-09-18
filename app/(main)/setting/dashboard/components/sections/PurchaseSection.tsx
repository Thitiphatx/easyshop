"use client"

import { ISummaryData } from '@/app/actions/interface'
import { getTransactionSummary } from '@/app/actions/transaction'
import { formatCurrency } from '@/app/utils/formatter'
import { IDashboardSectionProps } from '@/app/(main)/setting/dashboard/interface'
import Card from '@/components/Card/Card'
import Loading from '@/components/Loading'
import '@/lib/chart'
import Swal from '@/lib/Swal'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'

const PurchaseSection: React.FC<IDashboardSectionProps> = ({ type = 'week' }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [data, setData] = useState<ISummaryData>()

    const chartData = useMemo(() => ({
        labels: data?.label || [],
        datasets: [{
            label: 'Number of transactions',
            data: data?.data || [],
            borderWidth: 1,
            borderColor: '#db9f21',
            backgroundColor: '#ffc42b',
            pointRadius: 3,
        }]
    }), [data])

    const chartOptions = useMemo(() => ({
        plugins: {
            legend: { display: false }
        }
    }), [])

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        const res = await getTransactionSummary(type)
        if (res.success && res.data) {
            setData(res.data)
        } else {
            Swal.fire({
                icon: 'error',
                iconColor: 'var(--default-error)',
                title: res.error || 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้',
                text: res.error,
                theme: 'dark',
            })
        }
        setIsLoading(false)
    }, [type])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <Card cardTitle={
            <div>
                <h1>
                    Purchases
                    <span className='ml-4 font-sans text-sm'>
                        ({formatCurrency(data?.total || 0)})
                    </span>
                </h1>
            </div>
        }>
            {isLoading ?
                <Loading /> :
                <Line data={chartData} options={chartOptions} />}
        </Card>
    )
}

export default PurchaseSection
