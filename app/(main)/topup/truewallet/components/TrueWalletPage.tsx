"use client"
import { redeem } from '@/app/actions/truewallet'
import { useAppForm } from '@/components/Form'
import Swal from '@/lib/Swal'
import { extractVoucherCode } from '@prakrit_m/tmn-voucher'
import Image from "next/image"
import React from 'react'
import { TrueWalletSchema } from '../schema'

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
            <div className='relative max-w-4xl w-full px-4 py-12 sm:py-20 lg:py-24 mx-auto z-10 flex flex-col justify-center items-center'>
                <span className='flex flex-col w-fit items-center text-(--core-white) drop-shadow-lg text-center'>
                    <h1 className='font-pixel text-5xl sm:text-7xl lg:text-8xl font-bold'>TrueWallet</h1>
                    <h2 className='text-3xl sm:text-5xl font-bold mt-2'>กรอกลิงก์ซองของขวัญ</h2>
                </span>
                <form className='mt-6 w-full' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
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
            <div className='relative bg-(--core-off-black) w-full h-fit z-10 p-4 sm:p-8 lg:p-12'>
                <h1 className='text-2xl sm:text-4xl lg:text-5xl font-bold text-(--core-white) text-center font-pixel'>วิธีสร้างซองของขวัญ</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8 sm:mt-10 max-w-7xl mx-auto'>
                    <div className='flex flex-col items-center text-center p-3 bg-(--core-grey-6)/60 border border-(--core-grey-5) rounded-sm'>
                        <span className='font-pixel text-sm text-(--core-green-3) font-bold mb-2'>STEP 1</span>
                        <Image src={`/images/others/step-1.webp`} className='w-full max-w-[240px] h-auto object-contain rounded' width={720} height={1080} alt="Step-1" />
                        <p className='text-sm sm:text-base text-(--core-white) mt-3'>กดส่งซองทรูมันนี่ (ถ้าไม่มีกดดูทั้งหมด)</p>
                    </div>
                    <div className='flex flex-col items-center text-center p-3 bg-(--core-grey-6)/60 border border-(--core-grey-5) rounded-sm'>
                        <span className='font-pixel text-sm text-(--core-green-3) font-bold mb-2'>STEP 2</span>
                        <Image src={`/images/others/step-2.webp`} className='w-full max-w-[240px] h-auto object-contain rounded' width={720} height={1080} alt="Step-2" />
                        <p className='text-sm sm:text-base text-(--core-white) mt-3'>เลือกส่งให้คนเดียว กรอกจำนวนเงิน และกดถัดไป</p>
                    </div>
                    <div className='flex flex-col items-center text-center p-3 bg-(--core-grey-6)/60 border border-(--core-grey-5) rounded-sm'>
                        <span className='font-pixel text-sm text-(--core-green-3) font-bold mb-2'>STEP 3</span>
                        <Image src={`/images/others/step-3.webp`} className='w-full max-w-[240px] h-auto object-contain rounded' width={720} height={1080} alt="Step-3" />
                        <p className='text-sm sm:text-base text-(--core-white) mt-3'>ตรวจสอบจำนวนเงิน และกดยืนยัน</p>
                    </div>
                    <div className='flex flex-col items-center text-center p-3 bg-(--core-grey-6)/60 border border-(--core-grey-5) rounded-sm'>
                        <span className='font-pixel text-sm text-(--core-green-3) font-bold mb-2'>STEP 4</span>
                        <Image src={`/images/others/step-4.webp`} className='w-full max-w-[240px] h-auto object-contain rounded' width={720} height={1080} alt="Step-4" />
                        <p className='text-sm sm:text-base text-(--core-white) mt-3'>คัดลอกลิงค์ที่ได้มากรอกด้านบน</p>
                    </div>
                </div>
            </div>

            <div className='fixed top-0 left-0 w-full h-full bg-(--core-off-black)/40 z-0'>
            </div>
            <div className='fixed top-0 left-0 w-full h-full bg-[url(/images/others/MCV_SummerDrop_Hero_DotNet_Downloadable_Wallpaper_r1920x1080.png)] bg-cover bg-center -z-10'>
            </div>
        </div>
    )
}

export default TrueWalletPage