"use client"

import { getBankInfo, topupBank } from '@/app/actions/payment/bank'
import { IBank } from '@/app/actions/payment/types/bank-accounts'
import { useAuth } from '@/app/contexts/authContext'
import { useSetting } from '@/app/contexts/settingContext'
import { formatCurrency } from '@/app/utils/formatter'
import { fileToBase64 } from '@/app/utils/utils'
import Card from '@/components/Card/Card'
import { useAppForm } from '@/components/Form'
import Select from '@/components/Select/Select'
import Swal from '@/lib/Swal'
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ClosedTopupCard from '../../components/ClosedTopupCard'
import { BankSchema } from '../schema'

const BankPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [turnstileToken, setTurnstileToken] = useState<string>("")
    const [bankInfo, setBankInfo] = useState<IBank>()
    const [devMode, setDevMode] = useState<string>("success")
    const turnstileRef = useRef<TurnstileInstance>(null)
    const { setting } = useSetting()
    const { fetchSession } = useAuth()

    const form = useAppForm({
        defaultValues: { imageSlip: null as File | null, agree: false as boolean },
        validators: {
            onSubmit: BankSchema
        },
        onSubmit: async ({ value }) => {
            if (!value.imageSlip) return;
            const base64 = await fileToBase64(value.imageSlip)
            if (!base64) return;
            const res = await topupBank(base64, devMode, turnstileToken)
            if (res.success) {
                Swal.fire({
                    text: `ได้รับ ${formatCurrency(res.data.receivePoint)} พ้อยท์รวม ${formatCurrency(res.data.totalPoint)} พ้อยท์`,
                    icon: "success",
                })
            } else {
                Swal.fire({
                    text: res.error?.message,
                    icon: "error"
                })
            }
            handleReset()
        },
    })

    const isEnable = useMemo(() => setting?.enableBank && bankInfo, [setting, bankInfo])

    const fetchBankInfo = useCallback(async () => {
        setIsLoading(true)
        const res = await getBankInfo()

        if (res.success) {
            if (res.data) {
                setBankInfo(res.data)
            }
        } else {
            Swal.fire({
                text: res.error.message,
                icon: "error",
            })
        }

        setIsLoading(false)
    }, [])

    const handleReset = useCallback(() => {
        fetchSession()
        form.reset()
        turnstileRef.current?.reset()
        setTurnstileToken('')
    }, [fetchSession, form])

    useEffect(() => {
        fetchBankInfo()
    }, [fetchBankInfo])

    return (
        <div className='flex-1 w-full'>
            {/* Form Section */}
            <div className='relative max-w-6xl w-full px-4 py-12 sm:py-20 lg:py-24 mx-auto z-10 flex flex-col justify-center'>
                <span className='text-center text-(--core-white) drop-shadow-2xl flex flex-col items-center'>
                    <h1 className='font-pixel text-5xl sm:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-(image:--marketplace-gradient-gold)'>Bank</h1>
                    <h2 className='text-3xl sm:text-5xl font-bold mt-2'>อัปโหลดสลิปโอนเงิน</h2>
                </span>
                {isEnable ? (
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8 sm:mt-12'>
                        <div className='flex flex-col gap-2'>
                            {bankInfo ? (
                                <>
                                    <Card>
                                        <div className='grid grid-cols-2 gap-2 text-sm sm:text-base'>
                                            <b className='text-(--core-green-2)'>ธนาคาร</b>
                                            <p className='text-(--core-white)'>{bankInfo.bankNameTh}</p>
                                        </div>
                                    </Card>
                                    <Card>
                                        <div className='grid grid-cols-2 gap-2 text-sm sm:text-base'>
                                            <b className='text-(--core-green-2)'>ชื่อบัญชี</b>
                                            <p className='text-(--core-white)'>{bankInfo.nameTh}</p>
                                        </div>
                                    </Card>
                                    <Card>
                                        <div className='grid grid-cols-2 gap-2 text-sm sm:text-base'>
                                            <b className='text-(--core-green-2)'>เลขบัญชี</b>
                                            <p className='text-(--core-white)'>{bankInfo.bankNumber}</p>
                                        </div>
                                    </Card>
                                </>
                            ) : (
                                <Card>
                                    <h1 className='text-red-500 font-bold'>ไม่พบข้อมูลบัญชีธนาคาร</h1>
                                    <p>กรุณาติดต่อแอดมิน</p>
                                </Card>
                            )}
                        </div>
                        <Card className='col-span-1 lg:col-span-2'>
                            <div>
                                <p>Test Mode</p>
                                <Select onChange={(e) => setDevMode(e.target.value)} options={[{ label: "Success", value: "success" }, { label: "Fail", value: "fail" }, { label: "Duplicate", value: "duplicate" }]}></Select>
                            </div>
                            <form className='w-full' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                                <form.AppField
                                    name="imageSlip"
                                    children={(field) => <field.FileField label="ภาพสลิปโอนเงิน" required />}
                                />
                                <form.AppField
                                    name="agree"
                                    children={(field) => <field.CheckBoxField label="ยอมรับเงื่อนไข" />}
                                />
                                <Turnstile
                                    ref={turnstileRef}
                                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE!}
                                    onSuccess={(token) => setTurnstileToken(token)}
                                    onExpire={() => setTurnstileToken('')}
                                />
                                <form.AppForm>
                                    <form.SubmitButton isLoading={isLoading} block>ยืนยัน</form.SubmitButton>
                                </form.AppForm>
                            </form>
                        </Card>
                    </div>
                ) : (
                    <ClosedTopupCard />
                )}
            </div>
            <div className='fixed top-0 left-0 w-full h-full bg-(--core-off-black)/60 z-0' />
            <div className='fixed top-0 left-0 w-full h-full bg-[url(/images/others/wallpaper_minecraft_update_aquatic_1920x1080.png)] bg-cover bg-center -z-10' />
        </div>
    )
}

export default BankPage