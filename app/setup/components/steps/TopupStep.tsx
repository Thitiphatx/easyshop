'use client'

import React, { useState } from 'react'
import { ISetupTopup } from '@/app/actions/setup/interface'
import Card from '@/components/Card/Card'
import Input from '@/components/Input/Input'
import Button from '@/components/Button/Button'
import Checkbox from '@/components/Checkbox/Checkbox'
import Swal from '@/lib/Swal'
import { ChevronLeft, ChevronRight, CreditCard, InfoBox } from 'pixelarticons/react'

interface ITopupStepProps {
    data: ISetupTopup
    onBack: () => void
    onNext: (values: ISetupTopup) => void
}

export const TopupStep: React.FC<ITopupStepProps> = ({ data, onBack, onNext }) => {
    const [enableDirectTruewallet, setEnableDirectTruewallet] = useState(data.enableDirectTruewallet ?? false)
    const [truewalletPhoneNumber, setTruewalletPhoneNumber] = useState(data.truewalletPhoneNumber ?? '')
    const [enableTruewallet, setEnableTruewallet] = useState(data.enableTruewallet ?? false)
    const [enableBank, setEnableBank] = useState(data.enableBank ?? false)
    const [easyslipApiKey, setEasyslipApiKey] = useState(data.easyslipApiKey ?? '')

    const handleSkip = () => {
        onNext({
            enableDirectTruewallet: false,
            truewalletPhoneNumber: '',
            enableTruewallet: false,
            enableBank: false,
            easyslipApiKey: '',
        })
    }

    const handleNext = () => {
        // Validation if enabled
        if (enableDirectTruewallet) {
            const trimmedPhone = truewalletPhoneNumber.trim()
            if (!/^[0-9]{10}$/.test(trimmedPhone)) {
                Swal.fire({
                    icon: 'warning',
                    title: 'เบอร์โทรศัพท์ TrueWallet ไม่ถูกต้อง',
                    text: 'กรุณากรอกเบอร์โทรศัพท์ TrueMoney Wallet 10 หลัก หรือปิดการใช้งาน',
                    theme: 'dark',
                })
                return
            }
        }

        if (enableTruewallet || enableBank) {
            const trimmedApiKey = easyslipApiKey.trim()
            if (!trimmedApiKey) {
                Swal.fire({
                    icon: 'warning',
                    title: 'ต้องการ EasySlip API Key',
                    text: 'กรุณากรอก EasySlip API Key หากเปิดใช้งานช่องทาง TrueWallet หรือ Bank ผ่าน EasySlip',
                    theme: 'dark',
                })
                return
            }
        }

        onNext({
            enableDirectTruewallet,
            truewalletPhoneNumber: truewalletPhoneNumber.trim(),
            enableTruewallet,
            enableBank,
            easyslipApiKey: easyslipApiKey.trim(),
        })
    }

    return (
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            {/* Left Column: Section Info */}
            <div className="w-full md:w-60 lg:w-64 shrink-0 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-(--core-grey-5) md:pr-6">
                <div className="flex items-center gap-2 text-(--core-gold-3) mb-1">
                    <CreditCard className="size-6" />
                    <span className="font-pixel text-xs tracking-wider">STEP 3</span>
                </div>
                <h2 className="font-pixel text-2xl md:text-3xl text-(--core-white)">Topup</h2>
                <p className="text-sm text-(--core-grey-3) mt-2 leading-relaxed">
                    ตั้งค่าช่องทางการเติมเงิน (ไม่บังคับ สามารถข้ามหรือตั้งค่าภายหลังได้ในเมนู Setting)
                </p>
            </div>

            {/* Right Column: Cards */}
            <div className="flex-1 max-w-3xl space-y-6">
                {/* Direct TrueWallet Section */}
                <Card cardTitle="True Wallet (ซองของขวัญ)">
                    <p className="text-xs text-(--core-grey-3) -mt-1 mb-4">
                        เติมเงินด้วยลิงก์ซองของขวัญ TrueMoney Wallet โดยตรง
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-(--core-grey-5)">
                            <div>
                                <span className="font-pixel text-sm text-(--core-white)">เปิดใช้งาน True Wallet</span>
                                <p className="text-xs text-(--core-grey-4)">ต้องระบุเบอร์โทรศัพท์ที่รับเงิน</p>
                            </div>
                            <Checkbox
                                id="setup-direct-tw"
                                variant="switch"
                                checked={enableDirectTruewallet}
                                onChange={(e) => setEnableDirectTruewallet(e.target.checked)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-pixel text-(--core-grey-3) mb-1">
                                เบอร์โทรศัพท์ TrueMoney Wallet
                            </label>
                            <Input
                                placeholder="เช่น 0812345678"
                                value={truewalletPhoneNumber}
                                onChange={(e) => setTruewalletPhoneNumber(e.target.value)}
                                className="w-full"
                                maxLength={10}
                            />
                        </div>
                    </div>
                </Card>

                {/* EasySlip Section */}
                <Card cardTitle="EasySlip API">
                    <p className="text-xs text-(--core-grey-3) -mt-1 mb-4">
                        ระบบตรวจสอบสลิปอัตโนมัติ สำหรับสแกน QR Code พร้อมเพย์ และ TrueMoney Wallet
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-(--core-grey-5)">
                            <div>
                                <span className="font-pixel text-sm text-(--core-white)">True Wallet (EasySlip)</span>
                                <p className="text-xs text-(--core-grey-4)">เช็คสลิป TrueWallet อัตโนมัติ</p>
                            </div>
                            <Checkbox
                                id="setup-es-tw"
                                variant="switch"
                                checked={enableTruewallet}
                                onChange={(e) => setEnableTruewallet(e.target.checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-(--core-grey-5)">
                            <div>
                                <span className="font-pixel text-sm text-(--core-white)">Bank / PromptPay</span>
                                <p className="text-xs text-(--core-grey-4)">เช็คสลิปโอนธนาคารอัตโนมัติ</p>
                            </div>
                            <Checkbox
                                id="setup-es-bank"
                                variant="switch"
                                checked={enableBank}
                                onChange={(e) => setEnableBank(e.target.checked)}
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-1.5 mb-1">
                                <label className="text-xs font-pixel text-(--core-grey-3)">
                                    EasySlip API Key
                                </label>
                                <span className="text-xs text-(--core-grey-4) flex items-center gap-1">
                                    <InfoBox className="size-3.5" /> easyslip.com
                                </span>
                            </div>
                            <Input
                                type="password"
                                placeholder="กรอก EasySlip API Key"
                                value={easyslipApiKey}
                                onChange={(e) => setEasyslipApiKey(e.target.value)}
                                className="w-full font-mono"
                            />
                        </div>
                    </div>
                </Card>

                {/* Action buttons */}
                <div className="flex flex-wrap justify-between items-center gap-3 pt-6 border-t border-(--core-grey-5)">
                    <Button
                        type="button"
                        color="Default"
                        onClick={onBack}
                        className="flex items-center gap-2"
                    >
                        <ChevronLeft className="size-5" />
                        <span>ย้อนกลับ</span>
                    </Button>

                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            color="Default"
                            variant="Outline"
                            onClick={handleSkip}
                        >
                            ข้ามขั้นตอนนี้
                        </Button>

                        <Button
                            type="button"
                            color="Green"
                            onClick={handleNext}
                            className="flex items-center gap-2"
                        >
                            <span>ถัดไป: ตั้งค่าผู้ดูแลระบบ</span>
                            <ChevronRight className="size-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopupStep
