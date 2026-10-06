'use client'

import { useAuth } from '@/app/contexts/authContext'
import { useSetting } from '@/app/contexts/settingContext'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Loading from '../Loading'

const GlobalLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoading: isAuthLoading } = useAuth()
    const { isLoading: isSettingLoading, setting } = useSetting()
    const [visible, setVisible] = useState(true)

    const isLoading = isAuthLoading || isSettingLoading

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                setVisible(false)
            }, 400)
            return () => clearTimeout(timer)
        }
    }, [isLoading])

    return (
        <>
            {visible && (
                <div
                    className="fixed inset-0 z-9999 flex flex-col items-center justify-center gap-4 bg-(--core-off-black) select-none transition-opacity duration-400"
                    style={{ opacity: isLoading ? 1 : 0 }}
                >
                    <Image src={setting?.logo || '/images/others/logo-short.png'} alt="Logo" width={120} height={120} className='animate-bounce' />
                    <Loading text='' />
                </div>
            )}
            {children}
        </>
    )
}

export default GlobalLoader
