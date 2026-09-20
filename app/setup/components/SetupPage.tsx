'use client'

import React, { useState } from 'react'
import { ISetupAdmin, ISetupPayload, ISetupServer, ISetupTopup, ISetupWebshop } from '@/app/actions/setup/interface'
import { completeSetup } from '@/app/actions/setup'
import Stepper from './Stepper'
import KeyGateStep from './steps/KeyGateStep'
import WebshopStep from './steps/WebshopStep'
import ServerStep from './steps/ServerStep'
import TopupStep from './steps/TopupStep'
import AdminStep from './steps/AdminStep'
import Swal from '@/lib/Swal'

export const SetupPage: React.FC = () => {
    const [isVerified, setIsVerified] = useState(false)
    const [setupKey, setSetupKey] = useState('')
    const [step, setStep] = useState<number>(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form data state across steps
    const [webshop, setWebshop] = useState<ISetupWebshop>({
        siteName: '',
        siteDesc: '',
        logo: '',
    })

    const [server, setServer] = useState<ISetupServer>({
        serverName: '',
        serverDesc: '',
        serverIp: '',
        serverImageUrl: '',
    })

    const [topup, setTopup] = useState<ISetupTopup>({
        enableDirectTruewallet: false,
        truewalletPhoneNumber: '',
        enableTruewallet: false,
        enableBank: false,
        easyslipApiKey: '',
    })

    const handleWebshopNext = (values: ISetupWebshop) => {
        setWebshop(values)
        setStep(2)
    }

    const handleServerNext = (values: ISetupServer) => {
        setServer(values)
        setStep(3)
    }

    const handleTopupNext = (values: ISetupTopup) => {
        setTopup(values)
        setStep(4)
    }

    const handleFinish = async (adminUsername: string) => {
        const confirm = await Swal.fire({
            icon: 'question',
            title: 'ยืนยันการตั้งค่าเริ่มต้น?',
            html: `
                <div class="text-sm text-left space-y-1">
                    <p><b>ชื่อเว็บช็อป:</b> ${webshop.siteName}</p>
                    <p><b>ชื่อเซิร์ฟเวอร์:</b> ${server.serverName} (${server.serverIp})</p>
                    <p><b>ผู้ดูแลระบบ (Admin):</b> ${adminUsername}</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'ยืนยันและเริ่มใช้งาน',
            cancelButtonText: 'แก้ไขข้อมูล',
            theme: 'dark',
        })

        if (!confirm.isConfirmed) return

        setIsSubmitting(true)
        const payload: ISetupPayload = {
            setupKey,
            webshop,
            server,
            topup,
            admin: { adminUsername },
        }

        const res = await completeSetup(payload)
        setIsSubmitting(false)

        if (!res.success) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาดในการตั้งค่า',
                text: res.error,
                theme: 'dark',
            })
            return
        }

        await Swal.fire({
            icon: 'success',
            title: 'ตั้งค่าระบบสำเร็จ!',
            text: 'ระบบ Easyshop พร้อมใช้งานแล้ว กำลังพาท่านไปยังหน้าหลัก...',
            timer: 2000,
            showConfirmButton: false,
            theme: 'dark',
        })

        window.location.href = '/'
    }

    if (!isVerified) {
        return (
            <div className="min-h-screen bg-(--core-off-black) flex items-center justify-center p-4">
                <KeyGateStep
                    onVerified={(key) => {
                        setSetupKey(key)
                        setIsVerified(true)
                    }}
                />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-(--core-off-black) text-(--core-white) py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header branding */}
                <div className="text-center space-y-2">
                    <h1 className="font-pixel text-3xl sm:text-4xl text-(--core-white) tracking-wider drop-shadow-md">
                        EASYSHOP INITIAL SETUP
                    </h1>
                    <p className="text-sm text-(--core-grey-3) max-w-lg mx-auto">
                        ยินดีต้อนรับสู่ระบบร้านค้า Easyshop กรุณากรอกข้อมูลเพื่อเริ่มต้นใช้งานระบบของคุณ
                    </p>
                </div>

                {/* Stepper Progress */}
                <Stepper currentStep={step} />

                {/* Step Card Container */}
                <div className="w-full drop-shadow-[0_4px_0px_rgba(0,0,0,0.25)] p-5 sm:p-8 bg-(--core-grey-6) text-(--core-white) border-l-2 border-b-2 border-l-(--core-rich-black) border-b-(--core-rich-black) border-r-2 border-r-(--core-grey-5) border-t-2 border-t-(--core-grey-5)">
                    {step === 1 && (
                        <WebshopStep
                            data={webshop}
                            onNext={handleWebshopNext}
                        />
                    )}

                    {step === 2 && (
                        <ServerStep
                            data={server}
                            onBack={() => setStep(1)}
                            onNext={handleServerNext}
                        />
                    )}

                    {step === 3 && (
                        <TopupStep
                            data={topup}
                            onBack={() => setStep(2)}
                            onNext={handleTopupNext}
                        />
                    )}

                    {step === 4 && (
                        <AdminStep
                            onBack={() => setStep(3)}
                            onFinish={handleFinish}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default SetupPage