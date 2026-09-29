"use client"

import { useAuth } from '@/app/contexts/authContext'
import { formatCurrency } from '@/app/utils/formatter'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    ChevronDown,
    ChevronRight,
    ChevronUp,
    CreditCard,
    Crown,
    Logout,
    Settings2,
    ShoppingBag,
    Wallet
} from 'pixelarticons/react'
import React, { useEffect, useRef, useState } from 'react'

export const AccountMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { session, signOut } = useAuth()
    const router = useRouter()
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen])

    if (!session) return null

    const handleNavigate = (path: string) => {
        setIsOpen(false)
        router.push(path)
    }

    const handleSignOut = async () => {
        setIsOpen(false)
        await signOut()
        router.refresh()
    }

    const avatarUrl = session.profileImageUrl || `https://mc-heads.net/avatar/${session.username}/48`

    return (
        <div ref={menuRef} className="relative inline-block text-left select-none">
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`flex items-center gap-2.5 px-3 py-1.5 transition-colors cursor-pointer border-t-2 border-l-2 border-b-2 border-r-2 ${isOpen
                    ? 'bg-(--core-grey-5) border-t-(--core-rich-black) border-l-(--core-rich-black) border-b-(--core-grey-4) border-r-(--core-grey-4)'
                    : 'bg-(--core-grey-6) hover:bg-(--core-grey-5) border-t-(--core-grey-5) border-l-(--core-grey-5) border-b-(--core-rich-black) border-r-(--core-rich-black) active:border-t-(--core-rich-black) active:border-l-(--core-rich-black) active:border-b-(--core-grey-4) active:border-r-(--core-grey-4)'
                    } drop-shadow-[0_3px_0px_rgba(0,0,0,0.25)]`}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                {/* Avatar */}
                <div className="relative shrink-0">
                    <img
                        src={avatarUrl}
                        alt={session.username}
                        width={28}
                        height={28}
                        className="w-7 h-7 object-contain [image-rendering:pixelated] ring-1 ring-(--core-green-5) bg-(--core-off-black)"
                    />
                    {session.isAdmin && (
                        <div className="absolute -top-1.5 -right-1.5 bg-(--marketplace-gold-5) text-(--core-rich-black) p-0.5 border border-(--marketplace-gold-3)">
                            <Crown className="size-2.5" />
                        </div>
                    )}
                </div>

                {/* User & Points info */}
                <div className="flex flex-col items-start leading-tight">
                    <span className="font-pixel text-xs font-bold text-(--core-white) truncate max-w-[110px]">
                        {session.username}
                    </span>
                </div>

                {/* Chevron */}
                <div className="text-(--core-grey-3) pl-0.5">
                    {isOpen ? (
                        <ChevronUp className="size-4 text-(--core-green-3)" />
                    ) : (
                        <ChevronDown className="size-4" />
                    )}
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 z-50 bg-(--core-grey-6) text-(--core-white) border-t-2 border-l-2 border-t-(--core-grey-5) border-l-(--core-grey-5) border-b-2 border-r-2 border-b-(--core-rich-black) border-r-(--core-rich-black) drop-shadow-[0_8px_0px_rgba(0,0,0,0.35)] animate-in fade-in-50 duration-100">
                    {/* Header: Profile info */}
                    <div className="p-3 bg-(--core-off-black)/70 border-b-2 border-(--core-grey-5) flex items-center gap-3 cursor-pointer hover:bg-(--core-grey-5)" onClick={() => handleNavigate('/user/profile')}>
                        <Image
                            src={avatarUrl}
                            alt={session.username}
                            width={44}
                            height={44}
                            className="w-11 h-11 [image-rendering:pixelated] ring-2 ring-(--core-green-5) bg-(--core-grey-6) p-0.5 shrink-0"
                        />
                        <div className="overflow-hidden flex-1">
                            <div className="font-pixel text-sm text-(--core-white) font-bold truncate">
                                {session.username}
                            </div>
                            <div className="mt-1 flex items-center gap-1.5">
                                {session.isAdmin ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-pixel text-(--marketplace-gold-3) bg-(--marketplace-gold-6)/40 px-1.5 py-0.5 border border-(--marketplace-gold-5)">
                                        <Crown className="size-3" /> ADMIN
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-pixel text-(--core-green-3) bg-(--core-green-6)/30 px-1.5 py-0.5 border border-(--core-green-5)">
                                        MEMBER
                                    </span>
                                )}
                            </div>
                        </div>
                        <ChevronRight className="size-3" />
                    </div>

                    {/* Points Balance Card */}
                    <div className="m-2.5 p-2.5 bg-(--core-off-black) border-t border-l border-(--core-rich-black) border-b border-r flex items-center justify-between">
                        <div>
                            <div className="text-[11px] text-(--core-grey-3) flex items-center gap-1.5">
                                <Wallet className="size-3.5 text-(--marketplace-gold-3)" />
                                พ้อยท์คงเหลือ
                            </div>
                            <div className="font-pixel text-base font-bold text-(--marketplace-gold-3) mt-0.5">
                                {formatCurrency(session.point)}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleNavigate('/topup')}
                            className="px-2.5 py-1 text-xs font-pixel font-bold bg-(--core-green-5) hover:bg-(--core-green-4) active:bg-(--core-green-6) text-(--core-white) border-t border-l border-(--core-green-3) border-b border-r border-(--core-green-6) cursor-pointer drop-shadow-sm transition-colors"
                        >
                            เติมเงิน
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <div className="p-1.5 space-y-0.5">
                        <button
                            type="button"
                            onClick={() => handleNavigate('/user/purchase-history')}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-(--core-grey-2) hover:text-(--core-white) hover:bg-(--core-grey-5) transition-colors cursor-pointer group text-left"
                        >
                            <div className="flex items-center gap-2.5">
                                <ShoppingBag className="size-4.5 text-(--core-grey-3) group-hover:text-(--core-green-3) transition-colors" />
                                <span>ประวัติการซื้อ</span>
                            </div>
                            <ChevronRight className="size-3 text-(--core-grey-4) opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </button>

                        <button
                            type="button"
                            onClick={() => handleNavigate('/user/topup-history')}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-(--core-grey-2) hover:text-(--core-white) hover:bg-(--core-grey-5) transition-colors cursor-pointer group text-left"
                        >
                            <div className="flex items-center gap-2.5">
                                <CreditCard className="size-4.5 text-(--core-grey-3) group-hover:text-(--core-green-3) transition-colors" />
                                <span>ประวัติการเติม</span>
                            </div>
                            <ChevronRight className="size-3 text-(--core-grey-4) opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </button>

                        {/* Admin section */}
                        {session.isAdmin && (
                            <>
                                <div className="border-t border-(--core-grey-5) my-1.5" />
                                <button
                                    type="button"
                                    onClick={() => handleNavigate('/setting/dashboard')}
                                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-(--marketplace-gold-3) hover:text-(--marketplace-gold-2) hover:bg-(--marketplace-gold-6)/20 transition-colors cursor-pointer group text-left"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Settings2 className="size-4.5 text-(--marketplace-gold-3)" />
                                        <span className="font-semibold">ตั้งค่าเว็บช็อป</span>
                                    </div>
                                    <ChevronRight className="size-3 text-(--marketplace-gold-4) opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                </button>
                            </>
                        )}

                        {/* Divider & Sign out */}
                        <div className="border-t border-(--core-grey-5) my-1.5" />
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-(--default-warning) hover:text-(--default-warning-2) hover:bg-(--default-warning)/15 transition-colors cursor-pointer group text-left"
                        >
                            <div className="flex items-center gap-2.5">
                                <Logout className="size-4.5 text-(--default-warning) group-hover:translate-x-0.5 transition-transform" />
                                <span>ออกจากระบบ</span>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AccountMenu
