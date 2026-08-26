"use client"

import { getTopups } from '@/app/actions/topup'
import { ITopup } from '@/app/actions/topup/interface'
import Swal from '@/lib/Swal'
import Table from '@/components/Table/Table'
import { ITableColumn } from '@/components/Table/interface'
import React, { useCallback, useEffect, useState } from 'react'
import Card from '@/components/Card/Card'

const statusLabel: Record<string, string> = {
    SUCCESS: 'สำเร็จ',
    PENDING: 'รอดำเนินการ',
    FAILED: 'ล้มเหลว',
}

const columns: ITableColumn<ITopup>[] = [
    {
        key: 'id',
        label: 'รายการที่',
        align: 'center',
    },
    {
        key: 'createdAt',
        label: 'วันที่เติม',
        render: (value: Date) => new Date(value).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }),
    },
    {
        key: 'channel',
        label: 'ช่องทาง',
    },
    {
        key: 'amount',
        label: 'จำนวนเงิน',
        align: 'right',
        render: (value: number) => `${value.toLocaleString()} บาท`,
    },
    {
        key: 'pointsAdded',
        label: 'พอยท์ที่ได้',
        align: 'right',
        render: (value: number) => `${value.toLocaleString()} พอยท์`,
    },
    {
        key: 'status',
        label: 'สถานะ',
        align: 'center',
        render: (value: string) => statusLabel[value] ?? value,
    },
]

const TopupHistory: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const [total, setTotal] = useState<number>(0)
    const size = 10
    const [topupHistory, setTopupHistory] = useState<ITopup[]>([])

    const getTopupHistory = useCallback(async () => {
        setIsLoading(true)
        const res = await getTopups({ page, size })
        if (res.success && res.data) {
            setTopupHistory(res.data.data)
            setTotal(res.data.total)
        } else {
            Swal.fire({
                text: res.error,
                icon: 'error'
            })
        }
        setIsLoading(false)
    }, [page])

    useEffect(() => {
        getTopupHistory()
    }, [getTopupHistory])

    return (
        <div className="h-full w-full">
            <Card className='min-h-full' cardTitle="ประวัติการเติมเงิน">
                <Table
                    columns={columns}
                    data={topupHistory}
                    loading={isLoading}
                    emptyText="ไม่มีประวัติการเติมเงิน"
                    pagination={{ page, total, size, onChange: setPage }}
                />
            </Card>
        </div>
    )
}

export default TopupHistory
