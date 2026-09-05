"use client"
import { getUsers } from '@/app/actions/user'
import { IUser } from '@/app/actions/user/interface'
import { formatCurrency, formatDateTime } from '@/app/utils/formatter'
import Badge from '@/components/Badge'
import Button from '@/components/Button/Button'
import Card from '@/components/Card/Card'
import { ITableColumn } from '@/components/Table/interface'
import Table from '@/components/Table/Table'
import Tooltip from '@/components/Tooltip'
import Swal from '@/lib/Swal'
import { Trash } from 'pixelarticons/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

const UserPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const [size, setSize] = useState<number>(10)
    const [total, setTotal] = useState<number>(0)
    const [users, setUsers] = useState<IUser[]>([]);

    const columns: ITableColumn<IUser>[] = useMemo(() => [
        {
            key: 'id',
            label: 'ID',
            align: 'center',
            render: (value: string, row: IUser) => <Tooltip content={row.uuid} position='top'>{value}</Tooltip>
        },
        {
            key: 'username',
            label: 'Username',
        },
        {
            key: 'lastlogin',
            label: 'เข้าเกมล่าสุด',
            render: (value: bigint) => {
                const timestamp = Number(value);
                const date = new Date(timestamp);
                return formatDateTime(date);
            },
        },
        {
            key: 'ip',
            label: 'IP',
        },
        {
            key: 'email',
            label: 'Email'
        },
        {
            key: 'isLogged',
            label: 'อยู่ในเกม',
            align: 'center',
            render: (value: number) => <Badge color={value == 1 ? 'Green' : 'Red'}>{value == 1 ? 'ออนไลน์' : 'ออฟไลน์'}</Badge>,
        },
        {
            key: 'points',
            label: 'Points',
            align: 'right',
            render: (_value: any, row: IUser) => formatCurrency(row.playerPoints.points)
        }
    ], [])

    const fetchUser = useCallback(async () => {
        setIsLoading(true)
        const res = await getUsers({ page, size })
        if (res.success && res.data) {
            setUsers(res.data.data)
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
        fetchUser()
    }, [fetchUser])

    return (
        <Card className='h-full' cardTitle="รายชื่อผู้เล่น">
            <Table columns={columns} loading={isLoading} data={users}
                emptyText="ไม่พบรายชื่อผู้เล่นในระบบ"
                pagination={{ page, total, size, onChange: setPage }}>

            </Table>
        </Card>
    )
}

export default UserPage