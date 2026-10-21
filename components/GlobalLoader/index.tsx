'use client'

import { useAuth } from '@/app/contexts/authContext'
import { useSetting } from '@/app/contexts/settingContext'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

const GlobalLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoading: isAuthLoading } = useAuth()
    const { isLoading: isSettingLoading } = useSetting()
    const pathname = usePathname()

    const isContextLoading = isAuthLoading || isSettingLoading
    const [progress, setProgress] = useState(0)
    const [visible, setVisible] = useState(false)
    const prevPathnameRef = useRef<string | null>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const startLoading = () => {
        if (timerRef.current) clearInterval(timerRef.current)
        setVisible(true)
        setProgress((prev) => (prev > 0 ? prev : 25))

        timerRef.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 85) {
                    if (timerRef.current) clearInterval(timerRef.current)
                    return 85
                }
                const increment = Math.max(1, (85 - prev) * 0.15)
                return Math.min(85, prev + increment)
            })
        }, 150)
    }

    const completeLoading = () => {
        if (timerRef.current) clearInterval(timerRef.current)
        setProgress(100)

        setTimeout(() => {
            setVisible(false)
            setTimeout(() => {
                setProgress(0)
            }, 300)
        }, 300)
    }

    // Handle initial context loading
    useEffect(() => {
        if (isContextLoading) {
            startLoading()
        } else {
            completeLoading()
        }
    }, [isContextLoading])

    // Trigger on Next.js pathname changes
    useEffect(() => {
        if (prevPathnameRef.current === null) {
            prevPathnameRef.current = pathname
            return
        }

        if (prevPathnameRef.current !== pathname) {
            prevPathnameRef.current = pathname
            startLoading()
            const completeTimer = setTimeout(() => {
                completeLoading()
            }, 250)
            return () => clearTimeout(completeTimer)
        }
    }, [pathname])

    // Pre-emptively start loading bar when clicking internal links
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement)?.closest('a')
            if (anchor && anchor.href && !anchor.target && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                try {
                    const targetUrl = new URL(anchor.href, window.location.origin)
                    if (targetUrl.origin === window.location.origin && targetUrl.pathname !== pathname) {
                        startLoading()
                    }
                } catch {
                    // Ignore invalid URLs
                }
            }
        }

        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [pathname])

    return (
        <>
            {/* Top Loading Bar */}
            <div
                className="fixed top-0 left-0 right-0 z-99999 h-[3px] pointer-events-none transition-opacity duration-300"
                style={{ opacity: visible ? 1 : 0 }}
            >
                <div
                    className="h-full bg-(--core-green-3) transition-all duration-300 ease-out shadow-[0_0_10px_var(--core-green-3),0_0_5px_var(--core-green-4)]"
                    style={{ width: `${progress}%` }}
                />
            </div>
            {children}
        </>
    )
}

export default GlobalLoader

