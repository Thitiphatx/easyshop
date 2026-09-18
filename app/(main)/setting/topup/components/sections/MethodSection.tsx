"use client"

import { updatePaymentMethod } from '@/app/actions/setting'
import { useSetting } from '@/app/contexts/settingContext'
import Card from '@/components/Card/Card'
import { useAppForm } from '@/components/Form'
import Swal from '@/lib/Swal'
import React from 'react'
import { MethodFormValues, MethodSchema } from '../../schema'

const MethodSection: React.FC = () => {
    const { isLoading, fetchSetting, setting } = useSetting()

    const form = useAppForm({
        defaultValues: {
            enableTruewallet: setting?.enableTruewallet ?? false,
            enableBank: setting?.enableBank ?? false,
        } as MethodFormValues,
        validators: {
            onSubmit: MethodSchema,
        },
        onSubmit: async ({ value }: { value: MethodFormValues }) => {
            const res = await updatePaymentMethod(value)
            if (!res.success) {
                Swal.fire({ icon: 'error', title: res.error })
            } else {
                Swal.fire({ icon: 'success', title: 'อัปเดตช่องทางการเติมเงินเรียบร้อยแล้ว' })
            }
            fetchSetting()
        },
    })

    return (
        <Card cardTitle="Payment Method" isLoading={isLoading} className='h-fit'>
            <form className='mt-6' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                <form.AppField
                    name="enableTruewallet"
                    children={(field) => <field.CheckboxField variant='switch' label="True Wallet" />}
                />
                <form.AppField
                    name="enableBank"
                    children={(field) => <field.CheckboxField variant='switch' label="ธนาคาร" tooltip="จำเป็นต้องมี Api Key ของ EasySlip" disabled={!setting?.easyslipApiKey} />}
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

export default MethodSection