"use client"
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getSetting } from '@/app/actions/setting'
import { IDisplaySetting, IServerSetting, displaySettingSelect, serverSettingSelect } from '@/app/actions/setting/interface'

interface MCServerStatus {
    online: boolean
    playersOnline: number
}

interface SettingContextValue {
    displaySetting: IDisplaySetting | null
    serverSetting: IServerSetting | null
    mcStatus: MCServerStatus | null
}

const SettingContext = createContext<SettingContextValue | null>(null)

export function SettingProvider({ children }: { children: React.ReactNode }) {
    const [displaySetting, setDisplaySetting] = useState<IDisplaySetting | null>(null)
    const [serverSetting, setServerSetting] = useState<IServerSetting | null>(null)
    const [mcStatus, setMcStatus] = useState<MCServerStatus | null>(null)

    const fetchDisplaySetting = useCallback(async () => {
        const res = await getSetting(displaySettingSelect)
        if (res.success && res.data) setDisplaySetting(res.data)
    }, [])

    const fetchServerSetting = useCallback(async () => {
        const res = await getSetting(serverSettingSelect)
        if (res.success && res.data) setServerSetting(res.data)
    }, [])

    const fetchMcStatus = useCallback(async (serverIp: string) => {
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
    }, [])

    useEffect(() => {
        fetchDisplaySetting()
        fetchServerSetting()
    }, [fetchDisplaySetting, fetchServerSetting])

    useEffect(() => {
        if (!serverSetting?.serverIp) return
        fetchMcStatus(serverSetting.serverIp)
    }, [serverSetting?.serverIp, fetchMcStatus])

    return (
        <SettingContext.Provider value={{ displaySetting, serverSetting, mcStatus }}>
            {children}
        </SettingContext.Provider>
    )
}

export function useSetting() {
    const ctx = useContext(SettingContext)
    if (!ctx) throw new Error('useSetting must be used within SettingProvider')
    return ctx
}
