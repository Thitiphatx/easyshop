"use client"

import { ISummaryData } from '@/app/actions/interface'
import { getTopupSummary } from '@/app/actions/topup'
import { getTransactionSummary } from '@/app/actions/transaction'
import { getUserSummary } from '@/app/actions/user'
import { SummaryType } from '@/app/utils/interface'
import Card from '@/components/Card/Card'
import Swal from '@/lib/Swal'
import React, { useCallback, useEffect, useState } from 'react'
import StatCard from './sections/StatCard'
import SummaryChart from './sections/SummaryChart'

type TabType = 'now' | 'month'

const TABS: { label: string; value: TabType }[] = [
    { label: 'Today', value: 'now' },
    { label: 'Monthly', value: 'month' },
]

const OverviewPage: React.FC = () => {
    const [tab, setTab] = useState<TabType>('now')
    const [isLoading, setIsLoading] = useState(false)
    const [users, setUsers] = useState<ISummaryData>()
    const [topups, setTopups] = useState<ISummaryData>()
    const [purchases, setPurchases] = useState<ISummaryData>()

    const fetchAll = useCallback(async (type: SummaryType) => {
        setIsLoading(true)
        const [userRes, topupRes, txRes] = await Promise.all([
            getUserSummary(type),
            getTopupSummary(type),
            getTransactionSummary(type),
        ])
        if (userRes.success && userRes.data) setUsers(userRes.data)
        else Swal.fire({ icon: 'error', iconColor: 'var(--default-error)', title: userRes.error, theme: 'dark' })
        if (topupRes.success && topupRes.data) setTopups(topupRes.data)
        if (txRes.success && txRes.data) setPurchases(txRes.data)
        setIsLoading(false)
    }, [])

    useEffect(() => {
        fetchAll(tab)
    }, [tab, fetchAll])

    return (
        <div className='flex flex-col gap-4'>
            {/* Tab selector */}
            <Card className='bg-(--dungeons-mulberry-5)! border-t-(--dungeons-mulberry-4)! border-r-(--dungeons-mulberry-4)!'>
                <div className='flex items-center gap-2 flex-wrap'>
                    <span className='font-pixel text-sm text-(--core-grey-3) mr-2'>Period</span>
                    {TABS.map(t => (
                        <button
                            key={t.value}
                            onClick={() => setTab(t.value)}
                            className={`font-pixel text-sm px-4 py-2 transition-colors cursor-pointer border-2 ${tab === t.value
                                ? 'bg-(--dungeons-mulberry-4) border-(--dungeons-mulberry-2) text-(--core-white)'
                                : 'bg-transparent border-(--core-grey-5) text-(--core-grey-3) hover:border-(--core-grey-4) hover:text-(--core-grey-2)'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Stat cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <StatCard
                    label='New Users'
                    data={users}
                    isLoading={isLoading}
                    accentColor='#6cc349'
                />
                <StatCard
                    label='Topups'
                    data={topups}
                    isLoading={isLoading}
                    accentColor='#36e6ff'
                />
                <StatCard
                    label='Purchases'
                    data={purchases}
                    isLoading={isLoading}
                    accentColor='#ffc42b'
                />
            </div>

            <SummaryChart
                users={users}
                topups={topups}
                purchases={purchases}
                isLoading={isLoading}
            />
        </div>
    )
}

export default OverviewPage
