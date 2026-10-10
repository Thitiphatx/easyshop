'use client'

import { useAuth } from '@/app/contexts/authContext'
import { useSetting } from '@/app/contexts/settingContext'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Loading from '../Loading'

const MIN_LOADING_TIME_MS = 300
const FADE_OUT_DURATION_MS = 400

const GlobalLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoading: isAuthLoading } = useAuth()
    const { isLoading: isSettingLoading, setting } = useSetting()

    const isLoading = isAuthLoading || isSettingLoading
    const [showLoader, setShowLoader] = useState(true)
    const [visible, setVisible] = useState(true)
    const startTimeRef = React.useRef<number>(Date.now())

    useEffect(() => {
        let fadeTimer: NodeJS.Timeout
        let hideTimer: NodeJS.Timeout

        if (isLoading) {
            startTimeRef.current = Date.now()
            setVisible(true)
            setShowLoader(true)
        } else {
            const elapsed = Date.now() - startTimeRef.current
            const remaining = Math.max(0, MIN_LOADING_TIME_MS - elapsed)

            fadeTimer = setTimeout(() => {
                setShowLoader(false)
                hideTimer = setTimeout(() => {
                    setVisible(false)
                }, FADE_OUT_DURATION_MS)
            }, remaining)
        }

        return () => {
            clearTimeout(fadeTimer)
            clearTimeout(hideTimer)
        }
    }, [isLoading])

    return (
        <>
            {visible && (
                <div
                    className={`fixed inset-0 z-9999 flex flex-col items-center justify-center gap-4 bg-(--core-off-black) select-none transition-opacity duration-400 ${!showLoader ? 'pointer-events-none' : ''}`}
                    style={{ opacity: showLoader ? 1 : 0 }}
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
