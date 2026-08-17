"use client"
import React, { createContext, useContext, useState } from 'react'
import AuthModal from '@/components/Auth/AuthModal'
import { ISessionPayload } from '@/app/actions/session/interface'

interface AuthContextValue {
    isOpen: boolean
    session: ISessionPayload | null
    openAuth: () => void
    closeAuth: () => void
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

    return (
        <AuthContext.Provider value={{ isOpen, session, openAuth, closeAuth, setIsOpen, setSession }}>
            {children}
            <AuthModal isOpen={isOpen} setIsOpen={setIsOpen} setSession={setSession} />
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
