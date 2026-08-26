"use client"

import { useAuth } from '@/app/contexts/authContext'
import Button from '@/components/Button/Button'
import clsx from 'clsx'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Bulletlist, Home, Image as ImgIcon, User } from 'pixelarticons/react'
import React, { useMemo } from 'react'

const LayoutTab: React.FC = () => {
    const router = useRouter()
    const path = usePathname()
    const { session } = useAuth()

    const menu = useMemo(() => [
        { label: 'Overview', href: '/setting/overview', icon: <Home className='size-8' />, active: path === '/setting/overview' },
        { label: 'Users', href: '/setting/users', icon: <User className='size-8' />, active: path === '/setting/users' },
        { label: 'Images', href: '/setting/images', icon: <ImgIcon className='size-8' />, active: path === '/setting/images' },
        { label: 'Logs', href: '/setting/logs', icon: <Bulletlist className='size-8' />, active: path === '/setting/logs' },
    ], [path])

    return (
        <div className="bg-(--core-grey-6)">
            <div className="w-full flex flex-col justify-center items-center gap-2 p-8">
                <Image src={`https://mc-heads.net/avatar/${session?.username}/128`} alt="Skin Profile" width={128} height={128} />
                <h1 className="font-pixel text-xl font-bold">{session?.username}</h1>
                <p className="text-(--marketplace-gold-3) font-bold">{session?.point.toLocaleString()} พอยท์</p>
            </div>
            <nav>
                <ul>
                    {menu.map((item) => (
                        <li key={item.label}>
                            <Button icon={item.icon} color="Default" variant='Outline' className={clsx('font-normal text-base! py-4 px-4!', item.active && 'bg-(--realms-deep-blue-3)! text-(--core-white)!')} onClick={() => router.push(item.href)} block>{item.label}</Button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}

export default LayoutTab