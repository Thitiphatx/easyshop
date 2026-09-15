"use client"

import { useAuth } from '@/app/contexts/authContext'
import Button from '@/components/Button/Button'
import clsx from 'clsx'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Bulletlist, BulletlistSharp, User } from 'pixelarticons/react'
import React, { useMemo } from 'react'

const LayoutTab: React.FC = () => {
    const router = useRouter()
    const path = usePathname()
    const { session } = useAuth()

    const menu = useMemo(() => [
        { label: 'Profile', href: '/user/profile', icon: <User className='size-5 sm:size-6 shrink-0' />, active: path === '/user/profile' },
        { label: 'Purchases', href: '/user/purchase-history', icon: <BulletlistSharp className='size-5 sm:size-6 shrink-0' />, active: path === '/user/purchase-history' },
        { label: 'Topups', href: '/user/topup-history', icon: <Bulletlist className='size-5 sm:size-6 shrink-0' />, active: path === '/user/topup-history' },
    ], [path])

    return (
        <div className="bg-(--core-grey-6) border-b-2 lg:border-b-0 lg:border-r-2 border-(--core-grey-5)">
            <div className="w-full flex flex-row lg:flex-col justify-start lg:justify-center items-center gap-4 p-4 lg:p-8">
                <img src={`https://mc-heads.net/avatar/${session?.username}/128`} alt="Skin Profile" className="size-12 sm:size-16 lg:size-32 shrink-0 rounded" width={128} height={128} />
                <div className="flex flex-col items-start lg:items-center">
                    <h1 className="font-pixel text-base sm:text-xl font-bold">{session?.username}</h1>
                    <p className="text-(--marketplace-gold-3) font-bold text-xs sm:text-sm lg:text-base">{session?.point.toLocaleString()} พอยท์</p>
                </div>
            </div>
            <nav className="p-2 lg:p-0">
                <ul className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                    {menu.map((item) => (
                        <li key={item.label}>
                            <Button
                                icon={item.icon}
                                color="Default"
                                variant='Outline'
                                className={clsx(
                                    'font-normal text-sm sm:text-base! py-3 lg:py-4 px-4! justify-start! gap-3',
                                    item.active && 'bg-(--realms-deep-blue-3)! text-(--core-white)!'
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