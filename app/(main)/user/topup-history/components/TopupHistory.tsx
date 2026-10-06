"use client"

import { getTopups } from '@/app/actions/topup'
import { ITopup } from '@/app/actions/topup/interface'
import Swal from '@/lib/Swal'
import Table from '@/components/Table/Table'
import { ITableColumn } from '@/components/Table/interface'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Card from '@/components/Card/Card'
import { useAuth } from '@/app/contexts/authContext'
import Button from '@/components/Button/Button'
import { Filter } from 'pixelarticons/react'
import Badge from '@/components/Badge'
import TableFilter from './TableFilter'
import { TopupFilterFormValues } from '../schema'

const statusColorMap: Record<string, "Green" | "Default" | "Red"> = {
    SUCCESS: 'Green',
    PENDING: 'Default',
    FAILED: 'Red',
}

const statusLabelMap: Record<string, string> = {
    SUCCESS: 'สำเร็จ',
    PENDING: 'รอดำเนินการ',
    FAILED: 'ล้มเหลว',
}

const TopupHistory: React.FC = () => {
    const { session, isLoading: isAuthLoading, openAuth } = useAuth()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isShowFilter, setShowFilter] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const [total, setTotal] = useState<number>(0)
    const size = 10
    const [topupHistory, setTopupHistory] = useState<ITopup[]>([])

    const columns: ITableColumn<ITopup>[] = useMemo(() => [
        {
            key: 'id',
            label: 'รายการที่',
            align: 'center',
            width: 100
        },
        {
            key: 'createdAt',
            label: 'วันที่เติม',
            width: 250,
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
            render: (value: string) => (
                <Badge color={statusColorMap[value] ?? 'Default'}>
                    {statusLabelMap[value] ?? value}
                </Badge>
            ),
        },
    ], [])

    const getTopupHistory = useCallback(async (filters?: TopupFilterFormValues) => {
        setIsLoading(true)
        const res = await getTopups({ page, size, ...filters })
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
        if (!isAuthLoading && !session) {
            Swal.fire({
                icon: 'info',
                title: 'กรุณาเข้าสู้ระบบก่อน',
            }).then(() => {
                openAuth()
            })
            return
        }
        if (!isAuthLoading && session) {
            getTopupHistory()
        }
    }, [isAuthLoading, session, getTopupHistory, openAuth])

    return (
        <div className="h-full w-full">
            <Card cardTitle={
                <div className='flex justify-between items-center'>
                    <div className='flex flex-col gap-1'>
                        <h1 className='font-pixel'>Topup History</h1>
                        <span className='text-sm text-(--core-off-white)'>ประวัติการเติมเงิน</span>
                    </div>
                    <Button onClick={() => setShowFilter((prev) => !prev)} isActive={isShowFilter} variant='Retro' color="Gold" icon={<Filter />} isIconOnly></Button>
                </div>
            }>
            </Card>
            <TableFilter hidden={!isShowFilter} fetchTopups={getTopupHistory} />
            <Card className='h-full'>
                <Table
                    columns={columns}
                    data={topupHistory}
                    emptyText="ไม่มีประวัติการเติมเงิน"
                    pagination={{ page, total, size, onChange: setPage }}
                />
            </Card>
        </div>
    )
}

export default TopupHistory
