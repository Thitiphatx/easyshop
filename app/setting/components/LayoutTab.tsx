"use client"

import { useAuth } from '@/app/contexts/authContext'
import Button from '@/components/Button/Button'
import clsx from 'clsx'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Bulletlist, BulletlistSharp, Home, Image as ImgIcon, Settings2, User } from 'pixelarticons/react'
import React, { useMemo } from 'react'

const LayoutTab: React.FC = () => {
    const router = useRouter()
    const path = usePathname()

    const menu = useMemo(() => [
        { label: 'Overview', href: '/setting/overview', icon: <Home className='size-8' />, active: path === '/setting/overview' },
        { label: 'Users', href: '/setting/users', icon: <User className='size-8' />, active: path === '/setting/users' },
        { label: 'Images', href: '/setting/images', icon: <ImgIcon className='size-8' />, active: path === '/setting/images' },
        { label: 'Purchases', href: '/setting/purchase-history', icon: <BulletlistSharp className='size-8' />, active: path === '/setting/purchase-history' },
        { label: 'Topups', href: '/setting/topup-history', icon: <Bulletlist className='size-8' />, active: path === '/setting/topup-history' },
    ], [path])

    return (
        <div className="bg-(--core-grey-6)">
            <div className="w-full flex flex-col justify-center items-center gap-2 p-8">
                <Settings2 className='size-[128]' />
                <h1 className="text-xl font-bold">จัดการเว็บช็อป</h1>
            </div>
            <nav>
                <ul>
                    {menu.map((item) => (
                        <li key={item.label}>
                            <Button icon={item.icon} color="Default" variant='Outline' className={clsx('font-normal text-base! py-4 px-4!', item.active && 'bg-(--realms-pink-2)! text-(--core-white)!')} onClick={() => router.push(item.href)} block>{item.label}</Button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}

export default LayoutTab