"use client"

import { updateEasySlipApi } from '@/app/actions/setting';
import { useSetting } from '@/app/contexts/settingContext';
import Card from '@/components/Card/Card';
import { useAppForm } from '@/components/Form';
import Swal from '@/lib/Swal';
import React from 'react';
import { EasyslipFormValues, EasyslipSchema } from '../../schema';

const EasySlipSection: React.FC = () => {
    const { isLoading } = useSetting()

    const form = useAppForm({
        defaultValues: {
            apiKey: "",
        } as EasyslipFormValues,
        validators: {
            onSubmit: EasyslipSchema,
        },
        onSubmit: async ({ value }: { value: EasyslipFormValues }) => {
            const res = await updateEasySlipApi(value)
            if (!res.success) {
                Swal.fire({ icon: 'error', title: res.error })
            } else {
                Swal.fire({ icon: 'success', title: 'บันทึกการตั้งค่าสำเร็จ' })
            }
        },
    })

    return (
        <Card cardTitle="Payment Method" isLoading={isLoading}>
            <form className='mt-6' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                <form.AppField
                    name="apiKey"
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