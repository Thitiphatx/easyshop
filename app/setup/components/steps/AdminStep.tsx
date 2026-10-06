'use client'

import { searchAuthMeUser } from '@/app/actions/setup'
import { IAuthMeUserPreview } from '@/app/actions/setup/interface'
import Badge from '@/components/Badge'
import Button from '@/components/Button/Button'
import Card from '@/components/Card/Card'
import Input from '@/components/Input/Input'
import { Check, ChevronLeft, Crown, InfoBox, Search } from 'pixelarticons/react'
import React, { useEffect, useState } from 'react'

interface IAdminStepProps {
    onBack: () => void
    onFinish: (adminUsername: string) => Promise<void>
    isSubmitting: boolean
}

export const AdminStep: React.FC<IAdminStepProps> = ({ onBack, onFinish, isSubmitting }) => {
    const [username, setUsername] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [foundUser, setFoundUser] = useState<IAuthMeUserPreview | null>(null)
    const [hasSearched, setHasSearched] = useState(false)

    const handleUsernameChange = (val: string) => {
        setUsername(val)
        if (!val.trim()) {
            setFoundUser(null)
            setHasSearched(false)
            setIsSearching(false)
        }
    }

    // Debounced real-time user lookup
    useEffect(() => {
        const trimmed = username.trim()
        if (!trimmed) return

        let cancelled = false
        const timer = setTimeout(async () => {
            setIsSearching(true)
            const res = await searchAuthMeUser(trimmed)
            if (cancelled) return
            setIsSearching(false)
            setHasSearched(true)
            if (res.success && res.data) {
                setFoundUser(res.data)
            } else {
                setFoundUser(null)
            }
        }, 400)

        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [username])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!foundUser) return
        await onFinish(foundUser.username)
    }

    return (
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            {/* Left Column: Section Info */}
            <div className="w-full md:w-60 lg:w-64 shrink-0 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-(--core-grey-5) md:pr-6">
                <div className="flex items-center gap-2 text-(--core-gold-3) mb-1">
                    <Crown className="size-6" />
                    <span className="font-pixel text-xs tracking-wider">STEP 4</span>
                </div>
                <h2 className="font-pixel text-2xl md:text-3xl text-(--core-white)">Admin</h2>
                <p className="text-sm text-(--core-grey-3) mt-2 leading-relaxed">
                    ค้นหาและแต่งตั้งผู้ดูแลระบบคนแรก โดยระบบจะค้นหาชื่อผู้เล่นจากฐานข้อมูล AuthMe แบบ Real-time
                </p>
                <p className="text-xs text-(--core-grey-4) mt-2 leading-relaxed">
                    * คุณสามารถเพิ่มหรือถอดถอนผู้ดูแลระบบคนอื่นๆ เพิ่มเติมได้ในภายหลังที่เมนู Setting &gt; Users
                </p>
            </div>

            {/* Right Column */}
            <div className="flex-1 max-w-3xl space-y-6">
                <Card cardTitle="ค้นหาผู้ดูแลระบบ">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-(--core-grey-3) mb-1.5">
                                ชื่อตัวละคร Minecraft (Authme Username)
                            </label>
                            <div className="relative">
                                <Input
                                    placeholder="พิมพ์ชื่อตัวละครในเกม เช่น Steve..."
                                    value={username}
                                    onChange={(e) => handleUsernameChange(e.target.value)}
                                    className="w-full pl-11 text-base font-sans"
                                    autoFocus
                                />
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--core-grey-4)">
                                    <Search className="size-5" />
                                </div>
                            </div>
                        </div>

                        {/* Player Preview Box */}
                        {foundUser && (
                            <div className="p-4 bg-(--core-off-black) border-2 border-(--core-green-4) flex flex-col sm:flex-row items-center gap-5 shadow-[0_4px_0_rgba(0,0,0,0.25)]">
                                <div className="shrink-0 bg-(--core-grey-6) p-2 border border-(--core-grey-5)">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={`https://mc-heads.net/body/${foundUser.username}/120`}
                                        alt={foundUser.username}
                                        className="h-28 w-auto object-contain"
                                    />
                                </div>

                                <div className="flex-1 text-center sm:text-left space-y-1.5">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        <span className="text-xl font-bold text-(--core-white) font-sans">
                                            {foundUser.username}
                                        </span>
                                        <Badge color="Gold" className="flex items-center gap-1 font-pixel text-xs">
                                            <Crown className="size-3.5" />
                                            <span>ADMIN</span>
                                        </Badge>
                                    </div>

                                    <div className="text-xs text-(--core-grey-3) font-mono break-all">
                                        UUID: {foundUser.uuid}
                                    </div>

                                    {foundUser.email && (
                                        <div className="text-xs text-(--core-grey-4)">
                                            อีเมล: {foundUser.email}
                                        </div>
                                    )}

                                    <div className="pt-2 text-xs text-(--core-green-3) flex items-center justify-center sm:justify-start gap-1">
                                        <Check className="size-4" />
                                        <span>พบข้อมูลผู้เล่นใน AuthMe พร้อมแต่งตั้งเป็น Admin</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Not found state */}
                        {!isSearching && hasSearched && !foundUser && username.trim() && (
                            <div className="p-4 bg-(--core-off-black) border-2 border-(--dungeons-red-5) text-center space-y-1">
                                <p className="text-sm font-semibold text-(--dungeons-red-3)">
                                    ไม่พบผู้เล่นชื่อ &quot;{username}&quot; ในระบบ
                                </p>
                                <p className="text-xs text-(--core-grey-3)">
                                    กรุณาเข้าเซิร์ฟเวอร์ Minecraft เพื่อทำการสมัครสมาชิก (/register) ก่อนค้นหา
                                </p>
                            </div>
                        )}

                        {/* Empty state hint */}
                        {!hasSearched && !username.trim() && (
                            <div className="p-4 bg-(--core-off-black) border border-(--core-grey-5) flex items-start gap-3">
                                <InfoBox className="size-5 text-(--core-gold-3) shrink-0 mt-0.5" />
                                <div className="text-xs text-(--core-grey-3) leading-relaxed space-y-1">
                                    <p>
                                        พิมพ์ชื่อผู้เล่นเพื่อค้นหาในฐานข้อมูล AuthMe เมื่อเลือกผู้เล่นนี้ ระบบจะมอบสิทธิ์ผู้ดูแลระบบ (isAdmin = 1) ทันทีที่เสร็จสิ้นการตั้งค่า
                                    </p>
                                    <p className="text-(--core-grey-4)">
                                        * สามารถเพิ่มหรือแต่งตั้งผู้ดูแลระบบคนอื่นๆ เพิ่มเติมได้ในภายหลังที่หน้า <b>ตั้งค่า &gt; จัดการผู้ใช้ (Users)</b>
                                    </p>
                                </div>
                            </div>
                        )}
                    </form>
                </Card>

                {/* Bottom Navigation */}
                <div className="flex justify-between items-center pt-6 border-t border-(--core-grey-5)">
                    <Button
                        type="button"
                        color="Default"
                        onClick={onBack}
                        disabled={isSubmitting}
                        className="flex items-center gap-2"
                    >
                        <ChevronLeft className="size-5" />
                        <span>ย้อนกลับ</span>
                    </Button>

                    <Button
                        type="button"
                        color="Green"
                        disabled={!foundUser || isSubmitting}
                        onClick={handleSubmit}
                        className="flex items-center gap-2"
                    >
                        <Crown className="size-5 text-(--core-gold-2)" />
                        <span>{isSubmitting ? 'กำลังบันทึก...' : 'เสร็จสิ้นการตั้งค่า'}</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AdminStep
