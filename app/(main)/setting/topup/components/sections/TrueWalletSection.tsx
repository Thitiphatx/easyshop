"use client"

import { updateTrueWalletSetting } from '@/app/actions/setting'
import { useSetting } from '@/app/contexts/settingContext'
import Card from '@/components/Card/Card'
import { useAppForm } from '@/components/Form'
import Swal from '@/lib/Swal'
import React from 'react'
import { TrueWalletFormValues, TrueWalletSchema } from '../../schema'

const TrueWalletSection: React.FC = () => {
    const { isLoading, fetchSetting, setting } = useSetting()

    const form = useAppForm({
        defaultValues: {
            enableDirectTruewallet: setting?.enableDirectTruewallet ?? false,
            truewalletPhoneNumber: setting?.truewalletPhoneNumber ?? '',
        } as TrueWalletFormValues,
        validators: {
            onSubmit: TrueWalletSchema,
        },
        onSubmit: async ({ value }: { value: TrueWalletFormValues }) => {
            const confirm = await Swal.fire({
                icon: 'warning',
                title: 'ตรวจสอบเบอร์โทรศัพท์ให้ถูกต้อง',
                text: 'หากกรอกผิดลูกค้าจะไม่สามารถเติมเงินได้',
                showCancelButton: true,
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
            })
            if (!confirm.isConfirmed) return

            const res = await updateTrueWalletSetting(value)
            if (!res.success) {
                Swal.fire({ icon: 'error', title: res.error })
            } else {
                Swal.fire({ icon: 'success', title: 'อัปเดตการตั้งค่า True Wallet เรียบร้อยแล้ว' })
                if (!value.truewalletPhoneNumber?.trim()) {
                    form.setFieldValue('enableDirectTruewallet', false)
                    form.setFieldValue('truewalletPhoneNumber', '')
                }
            }
            fetchSetting()
        },
    })

    return (
        <Card cardTitle="True Wallet" isLoading={isLoading} className='h-fit'>
            <form className='mt-6' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                <form.AppField
                    name="enableDirectTruewallet"
                    children={(field) => <field.CheckboxField variant='switch' label="True Wallet" tooltip="จำเป็นต้องระบุเบอร์โทรศัพท์ TrueMoney Wallet" disabled={!setting?.truewalletPhoneNumber} />}
                />
                <form.AppField
                    name="truewalletPhoneNumber"
                    children={(field) => <field.TextField label="เบอร์โทรศัพท์ TrueMoney Wallet" placeholder='กรอกเบอร์โทรศัพท์' required />}
                />
                <div className='flex justify-center'>
                    <form.AppForm>
                        <form.SubmitButton block>บันทึก</form.SubmitButton>
                    </form.AppForm>
                </div>
            </form>
        </Card>
    )
}

export default TrueWalletSection
