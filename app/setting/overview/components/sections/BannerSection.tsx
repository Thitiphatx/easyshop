"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Card from '@/components/Card/Card'
import Table from '@/components/Table/Table'
import { ITableColumn } from '@/components/Table/interface'
import { getAllBanners, deleteBanner } from '@/app/actions/banner'
import Swal from '@/lib/Swal'
import ModalManageBanner from '../modals/ModalManageBanner'
import Image from 'next/image'
import Loading from '@/components/Loading'
import Button from '@/components/Button/Button'
import { Banner } from '@/app/generated/prisma/client'
import { Plus, Trash } from 'pixelarticons/react'
import { getTopupSummary } from '@/app/actions/topup'

const BannerSection: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [banners, setBanners] = useState<Banner[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchBanners = useCallback(async () => {
        setIsLoading(true)
        const res = await getAllBanners()
        if (res.success && res.data) {
            setBanners(res.data)
        }
        setIsLoading(false)
    }, [])

    const handleDelete = useCallback(async (id: number) => {
        const confirm = await Swal.fire({
            icon: 'warning',
            iconColor: 'var(--default-warning)',
            title: 'ลบ Banner นี้?',
            text: 'Banner นี้จะถูกนำออกจากหน้าแรกของเว็บช็อป',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            confirmButtonColor: 'var(--default-warning)',
            cancelButtonText: 'ยกเลิก',
            theme: 'dark',
        })
        if (!confirm.isConfirmed) return
        const res = await deleteBanner(id)
        if (!res.success) {
            Swal.fire({ icon: 'error', title: res.error, theme: 'dark' })
        } else {
            Swal.fire({ icon: 'success', title: 'ลบ Banner เรียบร้อยแล้ว', theme: 'dark' })
            fetchBanners()
        }
    }, [fetchBanners])

    const columns: ITableColumn<Banner>[] = useMemo(() => [
        {
            key: 'imageUrl',
            label: 'Image',
            render: (_: any, row: Banner) => (
                <div className='relative w-32 h-16'>
                    <Image src={row.imageUrl} sizes="64px" alt="banner" fill className='object-cover rounded' />
                </div>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            align: 'right',
            render: (_: any, row: Banner) => (
                <div className='flex justify-end'>
                    <Button
                        variant='Solid'
                        color='Red'
                        onClick={() => handleDelete(row.id)}
                        icon={<Trash className='size-5' />}
                        iconPosition='end'
                        isIconOnly
                    />
                </div>
            )
        },
    ], [handleDelete])

    useEffect(() => {
        getTopupSummary()
        fetchBanners()
    }, [fetchBanners])

    return (
        <>
            <ModalManageBanner isOpen={isModalOpen} setIsOpen={setIsModalOpen} getBannerList={fetchBanners} />
            <Card cardTitle={
                <div className='flex justify-between'>
                    <h1>Banners</h1>
                    <Button
                        variant='Retro'
                        color='Green'
                        onClick={() => setIsModalOpen(true)}
                        icon={<Plus className='size-5' />}
                        isIconOnly
                    />
                </div>
            } className='h-fit'>
                {isLoading ? (
                    <div className='flex justify-center py-8'><Loading /></div>
                ) : (
                    <Table columns={columns} data={banners} loading={false} />
                )}
            </Card>
        </>
    )
}

export default BannerSection
