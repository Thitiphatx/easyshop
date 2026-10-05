"use client"

import { getTransactions } from '@/app/actions/transaction'
import { ITransaction } from '@/app/actions/transaction/interface'
import { formatCurrency, formatDateTime } from '@/app/utils/formatter'
import Card from '@/components/Card/Card'
import { ITableColumn } from '@/components/Table/interface'
import Table from '@/components/Table/Table'
import Swal from '@/lib/Swal'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import TableFilter from './TableFilter'
import { PurchaseFilterFormValues } from '../schema'
import Button from '@/components/Button/Button'
import { Filter } from 'pixelarticons/react'

const PurchasePage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isShowFilter, setShowFilter] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const [size] = useState<number>(10)
    const [total, setTotal] = useState<number>(0)
    const [transactions, setTransactions] = useState<ITransaction[]>([])

    const columns: ITableColumn<ITransaction>[] = useMemo(() => [
        {
            key: 'id',
            label: 'ID',
            align: 'center',
        },
        {
            key: 'username',
            label: 'Username',
        },
        {
            key: 'server',
            label: 'เซิร์ฟเวอร์',
            render: (_value, row: ITransaction) => row.server?.name ?? '-',
        },
        {
            key: 'item',
            label: 'ไอเท็ม',
            render: (_value, row: ITransaction) => row.item?.name ?? '-',
        },
        {
            key: 'pricePaid',
            label: 'ราคาที่จ่าย',
            align: 'right',
            render: (value: number) => `${formatCurrency(value)} พอยท์`,
        },
        {
            key: 'createdAt',
            label: 'วันที่ซื้อ',
            render: (value: Date) => formatDateTime(new Date(value)),
        },
    ], [])

    const fetchPurchases = useCallback(async (filters?: PurchaseFilterFormValues) => {
        setIsLoading(true)
        const res = await getTransactions({ page, size, ...filters })
        if (res.success && res.data) {
            setTransactions(res.data.data)
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
        fetchPurchases()
    }, [fetchPurchases])

    return (
        <div>
            <Card cardTitle={
                <div className='flex justify-between items-center'>
                    <div className='flex flex-col gap-1'>
                        <h1 className='font-pixel'>Purchases History</h1>
                        <span className='text-sm text-(--core-off-white)'>ประวัติการซื้อไอเท็มทั้งหมด</span>
                    </div>
                    <Button onClick={() => setShowFilter((prev) => !prev)} isActive={isShowFilter} variant='Retro' color="Gold" icon={<Filter />} isIconOnly></Button>
                </div>
            }>
            </Card>
            <TableFilter hidden={!isShowFilter} fetchPurchase={fetchPurchases} />
            <Card className='h-full'>
                <Table
                    columns={columns}
                    loading={isLoading}
                    data={transactions}
                    emptyText="ไม่พบประวัติการซื้อไอเท็มในระบบ"
                    pagination={{ page, total, size, onChange: setPage }}
                />
            </Card>
        </div>
    )
}

export default PurchasePage
