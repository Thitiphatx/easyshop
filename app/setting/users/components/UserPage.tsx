"use client"
import { getUsers, updateIsAdmin } from '@/app/actions/user'
import { IUser } from '@/app/actions/user/interface'
import { formatCurrency, formatDateTime } from '@/app/utils/formatter'
import Badge from '@/components/Badge'
import Button from '@/components/Button/Button'
import Card from '@/components/Card/Card'
import { ITableColumn } from '@/components/Table/interface'
import { Crown, Laugh } from 'pixelarticons/react'
import Table from '@/components/Table/Table'
import Tooltip from '@/components/Tooltip'
import Swal from '@/lib/Swal'
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
            render: (value: number) => <Badge color={value == 1 ? 'Green' : 'Red'}>{value == 1 ? 'ออนไลน์' : 'ออฟไลน์'}</Badge>
        },
        {
            key: 'points',
            label: 'Points',
            align: 'right',
            render: (_value: any, row: IUser) => formatCurrency(row.playerPoints.points)
        },
        {
            key: 'isAdmin',
            label: 'Webshop Role',
            align: 'center',
            render: (value: number, row: IUser) =>
                <Tooltip content={value == 1 ? "เปลี่ยนเป็น Player" : "แต่งตั้งเป็น Admin"} position='top'>
                    <Button onClick={() => handleChangeWebRole(row)} block variant='Ghost' color={value == 1 ? 'Green' : 'Red'}>{value == 1 ? <Crown /> : <Laugh />}</Button>
                </Tooltip>
        }
    ], [])

    const fetchUser = useCallback(async () => {
        setIsLoading(true)
        const res = await getUsers({ page, size, isAdmin: false })
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

    const handleChangeWebRole = useCallback(async (user: IUser) => {
        const res = await Swal.fire({
            icon: 'question',
            title: 'ต้องการเปลี่ยนสิทธิ์จัดการเว็บช็อป?',
            text: `คุณแน่ใจหรือไม่ว่าต้องการเปลี่ยน ${user.username} เป็น ${user.isAdmin ? 'Player' : 'Admin'}?`,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            showCancelButton: true,
        })

        if (res.isConfirmed) {
            const res = await updateIsAdmin(user.id, !user.isAdmin)
            if (res.success) {
                Swal.fire({
                    icon: 'success',
                    text: `เปลี่ยนสิทธิ์ของ ${user.username} เรียบร้อย`,
                })
                fetchUser()
            } else {
                Swal.fire({
                    icon: 'error',
                    text: res.error,
                })
            }
        }

    }, [])

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