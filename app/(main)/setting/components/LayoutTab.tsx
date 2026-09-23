"use client"

import Button from '@/components/Button/Button'
import clsx from 'clsx'
import { usePathname, useRouter } from 'next/navigation'
import { BulletlistSharp, Chart, CreditCard, Home, Image as ImgIcon, Settings2, User } from 'pixelarticons/react'
import React, { useMemo } from 'react'

const LayoutTab: React.FC = () => {
    const router = useRouter()
    const path = usePathname()

    const menu = useMemo(() => [
        { label: 'Dashboard', href: '/setting/dashboard', icon: <Chart className='size-5 sm:size-6 shrink-0' />, active: path === '/setting/dashboard' },
        { label: 'Display', href: '/setting/display', icon: <Home className='size-5 sm:size-6 shrink-0' />, active: path === '/setting/display' },
        { label: 'Users', href: '/setting/users', icon: <User className='size-5 sm:size-6 shrink-0' />, active: path === '/setting/users' },
        { label: 'Images', href: '/setting/images', icon: <ImgIcon className='size-5 sm:size-6 shrink-0' />, active: path === '/setting/images' },
        { label: 'Purchases', href: '/setting/purchase-history', icon: <BulletlistSharp className='size-5 sm:size-6 shrink-0' />, active: path === '/setting/purchase-history' },
        { label: 'Topup', href: '/setting/topup', icon: <CreditCard className='size-5 sm:size-6 shrink-0' />, active: path === '/setting/topup' },
    ], [path])

    return (
        <div className="bg-(--core-grey-6) border-b-2 lg:border-b-0 lg:border-r-2 border-(--core-grey-5)">
            <div className="w-full flex flex-row lg:flex-col justify-start lg:justify-center items-center gap-3 sm:gap-4 p-4 lg:p-8">
                <Settings2 className='size-8 sm:size-12 lg:size-28 shrink-0 text-(--marketplace-gold-3)' />
                <h1 className="text-base sm:text-lg lg:text-xl font-bold font-pixel">จัดการเว็บช็อป</h1>
            </div>
            <nav className="p-2 lg:p-0">
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1">
                    {menu.map((item) => (
                        <li key={item.label}>
                            <Button
                                icon={item.icon}
                                color="Default"
                                variant='Outline'
                                className={clsx(
                                    'font-normal text-sm sm:text-base! py-3 lg:py-4 px-4! justify-start! gap-3',
                                    item.active && 'bg-(--realms-pink-2)! text-(--core-white)!'
                                )}
                                onClick={() => router.push(item.href)}
                                block
                            >
                                <span className="truncate">{item.label}</span>
                            </Button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}

export default LayoutTab