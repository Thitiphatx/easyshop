"use client"

import { updateEasySlipApi } from '@/app/actions/setting'
import { Setting } from '@/app/generated/prisma/client'
import { useSetting } from '@/app/contexts/settingContext'
import Card from '@/components/Card/Card'
import { useAppForm } from '@/components/Form'
import Swal from '@/lib/Swal'
import React from 'react'
import { EasyslipFormValues, EasyslipSchema } from '../../schema'

const EasySlipSection: React.FC = () => {
    const { isLoading, fetchSetting, setting } = useSetting()

    const form = useAppForm({
        defaultValues: {
            enableTruewallet: setting?.enableTruewallet ?? false,
            enableBank: setting?.enableBank ?? false,
            easyslipApiKey: (setting as Setting)?.easyslipApiKey ?? '',
        } as EasyslipFormValues,
        validators: {
            onSubmit: EasyslipSchema,
        },
        onSubmit: async ({ value }: { value: EasyslipFormValues }) => {
            const confirm = await Swal.fire({
                icon: 'warning',
                title: 'ยืนยันการตั้งค่า EasySlip',
                text: 'โปรดตรวจสอบข้อมูลให้ถูกต้อง',
                showCancelButton: true,
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
            })
            if (!confirm.isConfirmed) return

            const res = await updateEasySlipApi(value)
            if (!res.success) {
                Swal.fire({ icon: 'error', title: res.error })
            } else {
                Swal.fire({ icon: 'success', title: 'บันทึกการตั้งค่าสำเร็จ' })
                if (!value.easyslipApiKey?.trim()) {
                    form.setFieldValue('enableTruewallet', false)
                    form.setFieldValue('enableBank', false)
                    form.setFieldValue('easyslipApiKey', '')
                }
            }
            fetchSetting()
        },
    })

    return (
        <Card cardTitle="EasySlip" isLoading={isLoading} className='h-fit'>
            <form className='mt-6' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                <form.AppField
                    name="enableTruewallet"
                    children={(field) => <field.CheckboxField variant='switch' label="True Wallet" tooltip="จำเป็นต้องมี Api Key ของ EasySlip" disabled={!(setting as Setting)?.easyslipApiKey} />}
                />
                <form.AppField
                    name="enableBank"
                    children={(field) => <field.CheckboxField variant='switch' label="Bank" tooltip="จำเป็นต้องมี Api Key ของ EasySlip" disabled={!(setting as Setting)?.easyslipApiKey} />}
                />
                <form.AppField
                    name="easyslipApiKey"
                    children={(field) => <field.TextField label="EasySlip API Key" placeholder='กรอก API Key' type="password" tooltip="ไปที่ https://easyslip.com เพื่อขอ API Key (มีค่าบริการตามการใช้งาน)" />}
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

export default EasySlipSection