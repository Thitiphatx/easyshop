"use client"
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import AuthModal from '@/components/Auth/AuthModal'
import { ISessionPayload } from '@/app/actions/session/interface'
import { deleteSession, getSession, refreshSession } from '../actions/session'
import Swal from '@/lib/Swal'

interface AuthContextValue {
    isOpen: boolean
    isLoading: boolean
    session: ISessionPayload | null
    fetchSession: () => Promise<void>
    openAuth: () => void
    closeAuth: () => void
    signOut: () => Promise<void>
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    setSession: React.Dispatch<React.SetStateAction<ISessionPayload | null>>
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
    children: React.ReactNode
    initialSession?: ISessionPayload | null
}

export function AuthProvider({ children, initialSession = null }: AuthProviderProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [session, setSession] = useState<ISessionPayload | null>(initialSession)

    const openAuth = () => setIsOpen(true)
    const closeAuth = () => setIsOpen(false)

    const fetchSession = useCallback(async () => {
        setIsLoading(true)
        await refreshSession()
        const res = await getSession()
        setSession(res)
        setIsLoading(false)
    }, [])

    const signOut = useCallback(async () => {
        setIsLoading(true)
        const res = await deleteSession()
        if (res.success) {
            Swal.fire({
                icon: 'success',
                title: "ออกจากระบบเรียบร้อย",
            });
            setSession(null)
        } else {
            Swal.fire({
                icon: 'error',
                title: res.error,
            });
        }
        setIsLoading(false)
    }, [])


    useEffect(() => {
        if (!initialSession) {
            fetchSession()
        }
    }, [initialSession, fetchSession])

    return (
        <AuthContext.Provider value={{ isOpen, isLoading, session, fetchSession, openAuth, closeAuth, signOut, setIsOpen, setSession }}>
            {children}
            <AuthModal />
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}

