"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Table from '@/components/Table/Table'
import { ITableColumn } from '@/components/Table/interface'
import { getAllBanners, deleteBanner } from '@/app/actions/banner'
import Swal from '@/lib/Swal'
import Image from 'next/image'
import Button from '@/components/Button/Button'
import { Banner } from '@/app/generated/prisma/client'
import { Plus, Trash } from 'pixelarticons/react'
import { getTopupSummary } from '@/app/actions/topup'
import Card from '@/components/Card/Card'
import ModalManageBanner from '../modals/ModalManageBanner'
import { IBannerSectionProps } from '../interface'
import clsx from 'clsx'

const BannerSection: React.FC<IBannerSectionProps> = ({
    className,
    ...props
}) => {
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
            <Card className="p-6 md:p-8">
                <div className={clsx("flex flex-col md:flex-row gap-6 md:gap-10", className)} {...props}>
                    <div className="w-full md:w-60 lg:w-64 shrink-0 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-(--core-grey-5) md:pr-6">
                        <h2 className="font-pixel text-2xl md:text-3xl text-(--core-white)">Banners</h2>
                        <p className="text-sm text-(--core-grey-3) mt-1.5 leading-relaxed">
                            จัดการรูปภาพแบนเนอร์ที่จะแสดงผลบนหน้าแรกของเว็บช็อป
                        </p>
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                            <span className="text-sm text-(--core-grey-3)">รูปภาพแบนเนอร์ทั้งหมด ({banners.length})</span>
                            <Button
                                variant="Retro"
                                color="Green"
                                onClick={() => setIsModalOpen(true)}
                                icon={<Plus className="size-5" />}
                            >
                                เพิ่ม Banner
                            </Button>
                        </div>
                        <Table columns={columns} data={banners} loading={isLoading} />
                    </div>
                </div>
            </Card>
        </>
    )
}

export default BannerSection
