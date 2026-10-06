"use client"

import { getTransactions } from '@/app/actions/transaction'
import { ITransaction } from '@/app/actions/transaction/interface'
import Swal from '@/lib/Swal'
import Table from '@/components/Table/Table'
import { ITableColumn } from '@/components/Table/interface'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Card from '@/components/Card/Card'
import Button from '@/components/Button/Button'
import { Filter } from 'pixelarticons/react'
import TableFilter from './TableFilter'
import { PurchaseFilterFormValues } from '../schema'

const PurchaseHistory: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isShowFilter, setShowFilter] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const [total, setTotal] = useState<number>(0)
    const size = 10
    const [purchaseHistory, setPurchaseHistory] = useState<ITransaction[]>([])

    const columns: ITableColumn<ITransaction>[] = useMemo(() => [
        {
            key: 'id',
            label: 'รายการที่',
            align: 'center',
            width: 100
        },
        {
            key: 'createdAt',
            label: 'วันที่ซื้อ',
            width: 250,
            render: (value: Date) => new Date(value).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }),
        },
        {
            key: 'server',
            label: 'เซิร์ฟเวอร์',
            width: 250,
            render: (_value: any, row: ITransaction) => row.server.name,
        },
        {
            key: 'item',
            label: 'ไอเท็ม',
            render: (_value: any, row: ITransaction) => row.item.name,
        },
        {
            key: 'pricePaid',
            label: 'ราคาที่จ่าย',
            align: 'right',
            render: (value: number) => `${value.toLocaleString()} พอยท์`,
        },
    ], [])

    const getPurchaseHistory = useCallback(async (filters?: PurchaseFilterFormValues) => {
        setIsLoading(true)
        const res = await getTransactions({ page, size, ...filters })
        if (res.success && res.data) {
            setPurchaseHistory(res.data.data)
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
        getPurchaseHistory()
    }, [getPurchaseHistory])

    return (
        <div className="h-full w-full">
            <Card cardTitle={
                <div className='flex justify-between items-center'>
                    <div className='flex flex-col gap-1'>
                        <h1 className='font-pixel'>Purchase History</h1>
                        <span className='text-sm text-(--core-off-white)'>ประวัติการซื้อไอเท็ม</span>
                    </div>
                    <Button onClick={() => setShowFilter((prev) => !prev)} isActive={isShowFilter} variant='Retro' color="Gold" icon={<Filter />} isIconOnly></Button>
                </div>
            }>
            </Card>
            <TableFilter hidden={!isShowFilter} fetchPurchase={getPurchaseHistory} />
            <Card className='h-full'>
                <Table
                    columns={columns}
                    data={purchaseHistory}
                    emptyText="ไม่มีประวัติการซื้อ"
                    pagination={{ page, total, size, onChange: setPage }}
                />
            </Card>
        </div>
    )
}

export default PurchaseHistory
