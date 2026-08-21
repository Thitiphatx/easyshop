"use client"
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import AuthModal from '@/components/Auth/AuthModal'
import { ISessionPayload } from '@/app/actions/session/interface'
import { deleteSession, getSession } from '../actions/session'
import Swal from '@/lib/Swal'

interface AuthContextValue {
    isOpen: boolean
    session: ISessionPayload | null
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
    const [isOpen, setIsOpen] = useState(false)
    const [session, setSession] = useState<ISessionPayload | null>(initialSession)

    const openAuth = () => setIsOpen(true)
    const closeAuth = () => setIsOpen(false)

    const fetchSession = useCallback(async () => {
        const res = await getSession()
        setSession(res)
    }, [])

    const signOut = useCallback(async () => {
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
    }, [])


    useEffect(() => {
        if (!initialSession) {
            fetchSession()
        }
    }, [initialSession, fetchSession])

    return (
        <AuthContext.Provider value={{ isOpen, session, openAuth, closeAuth, signOut, setIsOpen, setSession }}>
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

