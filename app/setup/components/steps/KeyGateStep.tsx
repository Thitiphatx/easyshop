'use client'

import React, { useState } from 'react'
import Card from '@/components/Card/Card'
import Input from '@/components/Input/Input'
import Button from '@/components/Button/Button'
import { verifySetupKey } from '@/app/actions/setup'
import Swal from '@/lib/Swal'
import { Lock, Shield } from 'pixelarticons/react'

interface IKeyGateStepProps {
    onVerified: (key: string) => void
}

export const KeyGateStep: React.FC<IKeyGateStepProps> = ({ onVerified }) => {
    const [key, setKey] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!key.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณากรอกรหัสผ่าน EASYSHOP_KEY',
                theme: 'dark',
            })
            return
        }

        setIsLoading(true)
        const res = await verifySetupKey(key)
        setIsLoading(false)

        if (!res.success) {
            Swal.fire({
                icon: 'error',
                title: 'เข้าสู่ระบบตั้งค่าไม่สำเร็จ',
                text: res.error,
                theme: 'dark',
            })
        } else {
            Swal.fire({
                icon: 'success',
                title: 'ยืนยันรหัสผ่านสำเร็จ',
                text: 'ยินดีต้อนรับสู่ขั้นตอนการตั้งค่าระบบ Easyshop',
                timer: 1500,
                showConfirmButton: false,
                theme: 'dark',
            })
            onVerified(key.trim())
        }
    }

    return (
        <Card className="max-w-xl mx-auto p-6 sm:p-8">
            <div className="flex flex-col items-center text-center mb-6">
                <div className="size-16 bg-(--core-grey-5) border-2 border-(--core-gold-4) flex items-center justify-center mb-4 shadow-[0_4px_0_rgba(0,0,0,0.3)]">
                    <Lock className="size-8 text-(--core-gold-3)" />
                </div>
                <h1 className="font-pixel text-2xl sm:text-3xl text-(--core-white) tracking-wide">
                    EASYSHOP SETUP
                </h1>
                <p className="text-sm text-(--core-grey-3) mt-2 max-w-sm">
                    กรุณากรอกรหัสผ่านความปลอดภัย (EASYSHOP_KEY ใน .env) เพื่อเข้าสู่กระบวนการตั้งค่าระบบครั้งแรก
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-pixel text-(--core-grey-2) mb-2">
                        SETUP KEY PASSWORD
                    </label>
                    <div className="relative">
                        <Input
                            type="password"
                            placeholder="กรอก EASYSHOP_KEY"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            className="w-full pl-11 font-mono"
                            autoFocus
                        />
                        <Shield className="size-5 absolute left-3 top-1/2 -translate-y-1/2 text-(--core-grey-4)" />
                    </div>
                </div>

                <Button
                    type="submit"
                    color="Green"
                    block
                    disabled={isLoading}
                >
                    {isLoading ? 'กำลังตรวจสอบ...' : 'ยืนยันรหัสผ่าน'}
                </Button>
            </form>
        </Card>
    )
}

export default KeyGateStep
