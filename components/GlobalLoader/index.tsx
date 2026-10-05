'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/app/contexts/authContext'
import { useSetting } from '@/app/contexts/settingContext'
import { Repeat } from 'pixelarticons/react'

const GlobalLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoading: isAuthLoading } = useAuth()
    const { isLoading: isSettingLoading } = useSetting()
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
                    <Repeat className="size-10 animate-spin" />
                    <p className="font-pixel text-sm">กำลังโหลด...</p>
                </div>
            )}
            {children}
        </>
    )
}

export default GlobalLoader
