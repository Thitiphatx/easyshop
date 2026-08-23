"use client"
import { useAppForm } from '@/components/Form'
import React, { useEffect } from 'react'
import { TrueWalletSchema } from '../schema'
import { checkStatus, redeem } from '@/app/actions/truewallet'
import { extractVoucherCode } from '@prakrit_m/tmn-voucher'
import Swal from '@/lib/Swal'

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
                        children={(field) => <field.TextField label="ลิงค์ซองของขวัญ" required />}
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
            <div className='relative bg-(--core-off-black) w-full h-96 z-10 p-12'>
                <h1 className='text-5xl font-bold text-(--core-white) text-center'>วิธีสร้างซองของขวัญ</h1>
            </div>

            <div className='fixed top-0 left-0 w-full h-full bg-(--core-off-black)/40 z-0'>
            </div>
            <div className='fixed top-0 left-0 w-full h-full bg-[url(https://images2.alphacoders.com/137/thumb-1920-1370592.jpeg)] bg-cover bg-center -z-10'>
            </div>
        </div>
    )
}

export default TrueWalletPage