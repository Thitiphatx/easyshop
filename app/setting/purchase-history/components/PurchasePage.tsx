"use client"

import { getTransactions } from '@/app/actions/transaction'
import { ITransaction } from '@/app/actions/transaction/interface'
import { formatCurrency, formatDateTime } from '@/app/utils/formatter'
import Card from '@/components/Card/Card'
import { ITableColumn } from '@/components/Table/interface'
import Table from '@/components/Table/Table'
import Swal from '@/lib/Swal'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

const PurchasePage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const [size, setSize] = useState<number>(10)
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

    const fetchPurchases = useCallback(async () => {
        setIsLoading(true)
        const res = await getTransactions({ page, size })
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
        <Card className='h-full' cardTitle="ประวัติการซื้อไอเท็มทั้งหมด">
            <Table
                columns={columns}
                loading={isLoading}
                data={transactions}
                emptyText="ไม่พบประวัติการซื้อไอเท็มในระบบ"
                pagination={{ page, total, size, onChange: setPage }}
            />
        </Card>
    )
}

export default PurchasePage
