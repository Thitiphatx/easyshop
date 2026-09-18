"use client"

import { getTransactions } from '@/app/actions/transaction'
import { ITransaction } from '@/app/actions/transaction/interface'
import Swal from '@/lib/Swal'
import Table from '@/components/Table/Table'
import { ITableColumn } from '@/components/Table/interface'
import React, { useCallback, useEffect, useState } from 'react'
import Card from '@/components/Card/Card'

const columns: ITableColumn<ITransaction>[] = [
    {
        key: 'id',
        label: 'รายการที่',
        align: 'center',
    },
    {
        key: 'createdAt',
        label: 'วันที่ซื้อ',
        render: (value: Date) => new Date(value).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }),
    },
    {
        key: 'server',
        label: 'เซิร์ฟเวอร์',
        render: (_value, row) => row.server.name,
    },
    {
        key: 'item',
        label: 'ไอเท็ม',
        render: (_value, row) => row.item.name,
    },
    {
        key: 'pricePaid',
        label: 'ราคาที่จ่าย',
        align: 'right',
        render: (value: number) => `${value.toLocaleString()} พอยท์`,
    },
]

const PurchaseHistory: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const [total, setTotal] = useState<number>(0)
    const size = 10
    const [purchaseHistory, setPurchaseHistory] = useState<ITransaction[]>([])

    const getPurchaseHistory = useCallback(async () => {
        setIsLoading(true)
        const res = await getTransactions({ page, size })
        if (res.success && res.data) {
            setPurchaseHistory(res.data.data)
            setTotal(100)
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
            <Card className='min-h-full' cardTitle="ประวัติการซื้อไอเท็ม">
                <Table
                    columns={columns}
                    data={purchaseHistory}
                    loading={isLoading}
                    emptyText="ไม่มีประวัติการซื้อ"
                    pagination={{ page, total, size, onChange: setPage }}
                />
            </Card>
        </div>
    )
}

export default PurchaseHistory
