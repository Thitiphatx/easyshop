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
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
            <Card cardTitle={
                <div className='flex justify-between items-center'>
                    <h1>True Wallet</h1>
                    <div>
                        <form.AppField
                            name="enableDirectTruewallet"
                            children={(field) => <field.CheckboxField variant='switch' label="" disabled={!setting?.truewalletPhoneNumber} />}
                        />
                    </div>
                </div>
            } isLoading={isLoading} className='h-fit'>
                <p className='mb-3'>จำเป็นต้องระบุเบอร์โทรศัพท์ True Wallet เพื่อเปิดใช้งาน</p>
                <form.AppField
                    name="truewalletPhoneNumber"
                    children={(field) => <field.TextField label="เบอร์โทรศัพท์ True Wallet" layout='horizontal' placeholder='กรอกเบอร์โทรศัพท์' required />}
                />
            </Card>
            <Card>
                <form.AppForm>
                    <form.SubmitButton block>บันทึก</form.SubmitButton>
                </form.AppForm>
            </Card>
        </form>
    )
}

export default TrueWalletSection
