"use client"
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getSetting } from '@/app/actions/setting'
import { Setting } from '@/app/generated/prisma/client'

interface MCServerStatus {
    online: boolean
    playersOnline: number
}

interface SettingContextValue {
    setting: Setting | null
    mcStatus: MCServerStatus | null
    fetchSetting: () => Promise<void>
    isLoading: boolean
}

const SettingContext = createContext<SettingContextValue | null>(null)

export function SettingProvider({ children }: { children: React.ReactNode }) {
    const [isSettingLoading, setIsSettingLoading] = useState<boolean>(false)
    const [isMcStatusLoading, setIsMcStatusLoading] = useState<boolean>(false)
    const [setting, setSetting] = useState<Setting | null>(null)
    const [mcStatus, setMcStatus] = useState<MCServerStatus | null>(null)

    const isLoading = useMemo(() => isSettingLoading || isMcStatusLoading, [isSettingLoading, isMcStatusLoading])

    const fetchSetting = useCallback(async () => {
        setIsSettingLoading(true)
        const res = await getSetting()
        if (res.success && res.data) setSetting(res.data)
        setIsSettingLoading(false)
    }, [])

    const fetchMcStatus = useCallback(async (serverIp: string) => {
        setIsMcStatusLoading(true)
        try {
            const res = await fetch(`https://api.mcstatus.io/v2/status/java/${serverIp}`)
            if (!res.ok) return
            const json = await res.json()
            setMcStatus({
                online: json.online,
                playersOnline: json.players?.online ?? 0,
            })
        } catch {
            setMcStatus(null)
        }
        setIsMcStatusLoading(false)
    }, [])

    useEffect(() => {
        fetchSetting()
    }, [fetchSetting])

    useEffect(() => {
        if (!setting?.serverIp) return
        fetchMcStatus(setting.serverIp)
    }, [setting?.serverIp, fetchMcStatus])

    return (
        <SettingContext.Provider value={{ isLoading, setting, mcStatus, fetchSetting }}>
            {children}
        </SettingContext.Provider>
    )
}

export function useSetting() {
    const ctx = useContext(SettingContext)
    if (!ctx) throw new Error('useSetting must be used within SettingProvider')
    return ctx
}
