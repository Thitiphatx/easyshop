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
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
            <Card cardTitle={
                <div className='flex justify-between items-center'>
                    <h1>EasySlip</h1>
                    <form.AppField
                        name="enableBank"
                        children={(field) => <field.CheckboxField variant='switch' label="" tooltip="" disabled={!(setting as Setting)?.easyslipApiKey} />}
                    />
                </div>
            } isLoading={isLoading} className='h-fit'>
                <p className='mb-3'>จำเป็นต้องระบุ API Key ของ EasySlip เพื่อเปิดใช้งาน</p>
                <form.AppField
                    name="easyslipApiKey"
                    children={(field) => <field.TextField layout='horizontal' label="EasySlip API Key" placeholder='กรอก API Key' type="password" tooltip="ไปที่ https://easyslip.com เพื่อขอ API Key (มีค่าบริการตามการใช้งาน)" />}
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

export default EasySlipSection