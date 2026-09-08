"use client"
import { redeem } from '@/app/actions/truewallet'
import { useAppForm } from '@/components/Form'
import Swal from '@/lib/Swal'
import { extractVoucherCode } from '@prakrit_m/tmn-voucher'
import React from 'react'
import { TrueWalletSchema } from '../schema'
import Image from "next/image"
import { ChevronRight } from 'pixelarticons/react'
import Button from '@/components/Button/Button'

const TrueWalletPage: React.FC = () => {
    const form = useAppForm({
        defaultValues: { giftUrl: '', agree: false },
        validators: {
            onSubmit: TrueWalletSchema
        },
        onSubmit: async ({ value }) => {
            const voucherCode = extractVoucherCode(value.giftUrl);
            if (!voucherCode) {
                return;
            }
            const res = await redeem(voucherCode)
            if (res.success) {
                Swal.fire({
                    text: `คุณได้รับพอยท์จำนวน ${res.data} บาท`,
                    icon: "success",
                })
            } else {
                Swal.fire({
                    text: res.error,
                    icon: "error"
                })
            }
        },
    })

    return (
        <div className='flex-1 w-full'>
            {/* Form Section */}
            <div className='relative max-w-4xl w-full p-32 mx-auto z-10'>
                <span className='text-center text-(--core-white) drop-shadow-lg'>
                    <h1 className='font-pixel text-8xl font-bold'>TrueWallet</h1>
                    <h2 className='text-5xl font-bold'>กรอกลิงก์ซองของขวัญ</h2>
                </span>
                <form className='mt-6' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                    <form.AppField
                        name="giftUrl"
                        children={(field) => <field.TextField label="ลิงค์ซองของขวัญ" placeholder='https://gift.truemoney.com/campaign/?v=xxxxxxxxxxxxxxxxx' required />}
                    />
                    <form.AppField
                        name="agree"
                        children={(field) => <field.CheckboxField label="ยอมรับเงื่อนไข" />}
                    />
                    <div className='flex justify-center'>
                        <form.AppForm>
                            <form.SubmitButton>ยืนยัน</form.SubmitButton>
                        </form.AppForm>
                    </div>
                </form>
            </div>

            {/* Tutorial Section */}
            <div className='relative bg-(--core-off-black) w-full h-fit z-10 p-12'>
                <h1 className='text-5xl font-bold text-(--core-white) text-center'>วิธีสร้างซองของขวัญ</h1>
                <div className='flex flex-nowrap items-center gap-10 mt-10'>
                    <div className='flex flex-col justify-center items-center'>
                        <Image src={`/images/others/step-1.webp`} className='w-120' width={720} height={1080} alt="Step-1" />
                        <p>กดส่งซองทรูมันนี่ (ถ้าไม่มีกดดูทั้งหมด)</p>
                    </div>
                    <ChevronRight className='w-24 h-24 text-(--core-green-3)' />
                    <div className='flex flex-col justify-center items-center'>
                        <Image src={`/images/others/step-2.webp`} className='w-120' width={720} height={1080} alt="Step-2" />
                        <p>เลือกส่งให้คนเดียว กรอกจำนวนเงิน และกดถัดไป</p>
                    </div>
                    <ChevronRight className='w-24 h-24 text-(--core-green-3)' />
                    <div className='flex flex-col justify-center items-center'>
                        <Image src={`/images/others/step-3.webp`} className='w-120' width={720} height={1080} alt="Step-3" />
                        <p>ตรวจสอบจำนวนเงิน และกดยืนยัน</p>
                    </div>
                    <ChevronRight className='w-24 h-24 text-(--core-green-3)' />
                    <div className='flex flex-col justify-center items-center'>
                        <Image src={`/images/others/step-4.webp`} className='w-120' width={720} height={1080} alt="Step-4" />
                        <p>คัดลอกลิงค์ที่ได้มากรอกด้านบน</p>
                    </div>

                </div>
            </div>

            <div className='fixed top-0 left-0 w-full h-full bg-(--core-off-black)/40 z-0'>
            </div>
            <div className='fixed top-0 left-0 w-full h-full bg-[url(https://images2.alphacoders.com/137/thumb-1920-1370592.jpeg)] bg-cover bg-center -z-10'>
            </div>
        </div>
    )
}

export default TrueWalletPage