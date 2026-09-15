"use client"

import { verifyBank } from '@/app/actions/payment/bank'
import { BANK_CODES } from '@/app/actions/payment/bank-codes'
import { fileToBase64 } from '@/app/utils/utils'
import Card from '@/components/Card/Card'
import { useAppForm } from '@/components/Form'
import Swal from '@/lib/Swal'
import React from 'react'
import { IBankPageProps } from '../interface'
import { BankSchema } from '../schema'

const BankPage: React.FC<IBankPageProps> = ({
    bankInfo
}) => {

    const form = useAppForm({
        defaultValues: { imageSlip: null as File | null, agree: false as boolean },
        validators: {
            onSubmit: BankSchema
        },
        onSubmit: async ({ value }) => {
            if (!value.imageSlip) return;
            const base64 = await fileToBase64(value.imageSlip)
            if (!base64) return;
            const res = await verifyBank(base64)
            if (res.success) {
                Swal.fire({
                    text: `คุณได้รับพอยท์จำนวน ${res.data.amountInOrder} บาท`,
                    icon: "success",
                })
            } else {
                Swal.fire({
                    text: res.error?.message,
                    icon: "error"
                })
            }
        },
    })

    return (
        <div className='flex-1 w-full'>
            {/* Form Section */}
            <div className='relative max-w-6xl w-full px-4 py-12 sm:py-20 lg:py-24 mx-auto z-10 flex flex-col justify-center'>
                <span className='text-center text-(--core-white) drop-shadow-lg flex flex-col justify-center items-center'>
                    <h1 className='font-pixel text-5xl sm:text-7xl lg:text-8xl font-bold'>Bank</h1>
                    <h2 className='text-3xl sm:text-5xl font-bold mt-2'>อัปโหลดสลิปโอนเงิน</h2>
                </span>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8 sm:mt-12'>
                    <div className='flex flex-col gap-2'>
                        <Card>
                            <div className='grid grid-cols-2 gap-2 text-sm sm:text-base'>
                                <b className='text-(--core-green-2)'>ธนาคาร</b>
                                <p className='text-(--core-white)'>{BANK_CODES[bankInfo.bankCode].nameTh}</p>
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
                    </div>
                    <Card className='col-span-1 lg:col-span-2'>
                        <form className='w-full' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                            <form.AppField
                                name="imageSlip"
                                children={(field) => <field.FileField label="ภาพสลิปโอนเงิน" required />}
                            />
                            <form.AppField
                                name="agree"
                                children={(field) => <field.CheckboxField label="ยอมรับเงื่อนไข" />}
                            />
                            <form.AppForm>
                                <form.SubmitButton block>ยืนยัน</form.SubmitButton>
                            </form.AppForm>
                        </form>
                    </Card>
                </div>
            </div>
            <div className='fixed top-0 left-0 w-full h-full bg-(--core-off-black)/40 z-0'>
            </div>
            <div className='fixed top-0 left-0 w-full h-full bg-[url(/images/others/wallpaper_minecraft_update_aquatic_1920x1080.png)] bg-cover bg-center -z-10'>
            </div>
        </div>
    )
}

export default BankPage