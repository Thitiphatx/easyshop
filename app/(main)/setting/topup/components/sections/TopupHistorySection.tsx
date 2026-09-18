"use client"

import { getTopups } from '@/app/actions/topup'
import { ITopup } from '@/app/actions/topup/interface'
import { formatCurrency, formatDateTime } from '@/app/utils/formatter'
import Badge from '@/components/Badge'
import Card from '@/components/Card/Card'
import { ITableColumn } from '@/components/Table/interface'
import Table from '@/components/Table/Table'
import Swal from '@/lib/Swal'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { IMethodSectionProps } from '../../interface'
import clsx from 'clsx'

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

const TopupHistorySection: React.FC<IMethodSectionProps> = ({ className }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const [size, setSize] = useState<number>(10)
    const [total, setTotal] = useState<number>(0)
    const [topups, setTopups] = useState<ITopup[]>([])

    const columns: ITableColumn<ITopup>[] = useMemo(() => [
        {
            key: 'id',
            label: 'ID',
            align: 'center',
        },
        {
            key: 'user',
            label: 'Username',
            render: (_value, row: ITopup) => row.user?.username ?? '-',
        },
        {
            key: 'channel',
            label: 'ช่องทาง',
        },
        {
            key: 'amount',
            label: 'จำนวนเงิน',
            align: 'right',
            render: (value: number) => `${formatCurrency(value)} บาท`,
        },
        {
            key: 'pointsAdded',
            label: 'พอยท์ที่ได้',
            align: 'right',
            render: (value: number) => `${formatCurrency(value)} พอยท์`,
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
        {
            key: 'createdAt',
            label: 'วันที่เติม',
            render: (value: Date) => formatDateTime(new Date(value)),
        },
    ], [])

    const fetchTopups = useCallback(async () => {
        setIsLoading(true)
        const res = await getTopups({ page, size })
        if (res.success && res.data) {
            setTopups(res.data.data)
            setTotal(res.data.total)
        } else {
            Swal.fire({
                icon: 'error',
                title: res.error,
            })
        }
        setIsLoading(false)
    }, [page, size])

    useEffect(() => {
        fetchTopups()
    }, [fetchTopups])

    return (
        <Card className={clsx('h-full', className)} cardTitle="ประวัติการเติมเงินทั้งหมด">
            <Table
                columns={columns}
                loading={isLoading}
                data={topups}
                emptyText="ไม่พบประวัติการเติมเงินในระบบ"
                pagination={{ page, total, size, onChange: setPage }}
            />
        </Card>
    )
}

export default TopupHistorySection
