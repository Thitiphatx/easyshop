"use client"
import { redeem } from '@/app/actions/payment/truewallet'
import { useSetting } from '@/app/contexts/settingContext'
import Card from '@/components/Card/Card'
import { useAppForm } from '@/components/Form'
import Swal from '@/lib/Swal'
import { extractVoucherCode } from '@prakrit_m/tmn-voucher'
import Image from "next/image"
import React, { useCallback, useRef, useState } from 'react'
import ClosedTopupCard from '../../components/ClosedTopupCard'
import { TrueWalletSchema } from '../schema'
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile'
import { useAuth } from '@/app/contexts/authContext'

const TrueWalletPage: React.FC = () => {
    const [turnstileToken, setTurnstileToken] = useState<string>("")
    const { setting } = useSetting()
    const { fetchSession } = useAuth()
    const turnstileRef = useRef<TurnstileInstance>(null)

    const form = useAppForm({
        defaultValues: { giftUrl: '', agree: false },
        validators: {
            onSubmit: TrueWalletSchema
        },
        onSubmit: async ({ value }) => {
            const voucherCode = extractVoucherCode(value.giftUrl);
            if (!voucherCode) {
                Swal.fire({
                    icon: "error",
                    text: "ไม่พบรหัสในซองของขวัญ"
                })
                return;
            }
            const res = await redeem(voucherCode, turnstileToken)
            if (res.success) {
                Swal.fire({
                    text: `คุณได้รับพอยท์จำนวน ${res.data.receivePoint} พอยท์`,
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

    const handleReset = useCallback(() => {
        fetchSession()
        form.reset()
        turnstileRef.current?.reset()
        setTurnstileToken('')
    }, [fetchSession, form])

    return (
        <div className='flex-1 w-full'>
            <div className='relative max-w-4xl w-full px-4 py-12 sm:py-20 lg:py-24 mx-auto z-10 flex flex-col justify-center items-center'>
                <span className='text-center text-(--core-white) drop-shadow-2xl flex flex-col items-center'>
                    <h1 className='font-pixel text-5xl sm:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-(image:--marketplace-gradient-gold)'>TrueWallet</h1>
                    <h2 className='text-3xl sm:text-5xl font-bold mt-2'>กรอกลิงก์ซองของขวัญ</h2>
                </span>
                {setting?.enableTruewallet ? (
                    <Card className='mt-8 sm:mt-12 w-full max-w-2xl'>
                        <form className='w-full' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                            <form.AppField
                                name="giftUrl"
                                children={(field) => <field.TextField label="ลิงค์ซองของขวัญ" placeholder='https://gift.truemoney.com/campaign/?v=xxxxxxxxxxxxxxxxx' required />}
                            />
                            <form.AppField
                                name="agree"
                                children={(field) => <field.CheckboxField label="ยอมรับเงื่อนไข" />}
                            />
                            <Turnstile
                                ref={turnstileRef}
                                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE!}
                                onSuccess={(token) => setTurnstileToken(token)}
                                onExpire={() => setTurnstileToken('')}
                            />
                            <form.AppForm>
                                <form.SubmitButton block>ยืนยัน</form.SubmitButton>
                            </form.AppForm>
                        </form>
                    </Card>
                ) : (
                    <ClosedTopupCard />
                )}
            </div>

            <div className='relative bg-(--core-off-black) w-full h-fit z-10 p-4 sm:p-8 lg:p-12'>
                <h2 className='text-2xl sm:text-4xl lg:text-5xl font-bold text-(--core-white) text-center mb-6 sm:mb-8'>วิธีสร้างซองของขวัญ</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto'>
                    <Card className='flex flex-col items-center text-center p-3'>
                        <span className='font-pixel text-sm text-(--core-green-3) font-bold mb-2'>STEP 1</span>
                        <Image src={`/images/others/step-1.webp`} className='w-full max-w-60 h-auto object-contain rounded' width={720} height={1080} alt="Step-1" />
                        <p className='text-sm sm:text-base text-(--core-white) mt-3'>กดส่งซองทรูมันนี่ (ถ้าไม่มีกดดูทั้งหมด)</p>
                    </Card>
                    <Card className='flex flex-col items-center text-center p-3'>
                        <span className='font-pixel text-sm text-(--core-green-3) font-bold mb-2'>STEP 2</span>
                        <Image src={`/images/others/step-2.webp`} className='w-full max-w-60 h-auto object-contain rounded' width={720} height={1080} alt="Step-2" />
                        <p className='text-sm sm:text-base text-(--core-white) mt-3'>เลือกส่งให้คนเดียว กรอกจำนวนเงิน และกดถัดไป</p>
                    </Card>
                    <Card className='flex flex-col items-center text-center p-3'>
                        <span className='font-pixel text-sm text-(--core-green-3) font-bold mb-2'>STEP 3</span>
                        <Image src={`/images/others/step-3.webp`} className='w-full max-w-60 h-auto object-contain rounded' width={720} height={1080} alt="Step-3" />
                        <p className='text-sm sm:text-base text-(--core-white) mt-3'>ตรวจสอบจำนวนเงิน และกดยืนยัน</p>
                    </Card>
                    <Card className='flex flex-col items-center text-center p-3'>
                        <span className='font-pixel text-sm text-(--core-green-3) font-bold mb-2'>STEP 4</span>
                        <Image src={`/images/others/step-4.webp`} className='w-full max-w-60 h-auto object-contain rounded' width={720} height={1080} alt="Step-4" />
                        <p className='text-sm sm:text-base text-(--core-white) mt-3'>คัดลอกลิงค์ที่ได้มากรอกด้านบน</p>
                    </Card>
                </div>
            </div>

            <div className='fixed top-0 left-0 w-full h-full bg-(--core-off-black)/60 z-0' />
            <div className='fixed top-0 left-0 w-full h-full bg-[url(/images/others/MCV_SummerDrop_Hero_DotNet_Downloadable_Wallpaper_r1920x1080.png)] bg-cover bg-center -z-10' />
        </div>
    )
}

export default TrueWalletPage