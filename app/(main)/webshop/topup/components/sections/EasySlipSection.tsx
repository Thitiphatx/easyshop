"use client"

import { updateEasySlipApi } from '@/app/actions/setting'
import { Setting } from '@/app/generated/prisma/client'
import { useSetting } from '@/app/contexts/settingContext'
import Card from '@/components/Card/Card'
import { useAppForm } from '@/components/Form'
import Swal from '@/lib/Swal'
import React, { useEffect } from 'react'
import { EasyslipFormValues, EasyslipSchema } from '../../schema'

const EasySlipSection: React.FC = () => {
    const { isLoading, fetchSetting, setting } = useSetting()

    const defaultValues = React.useMemo<EasyslipFormValues>(() => ({
        enableBank: setting?.enableBank ?? false,
        easyslipApiKey: (setting as Setting)?.easyslipApiKey ?? '',
    }), [setting])

    const form = useAppForm({
        defaultValues,
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
                    form.setFieldValue('enableBank', false)
                    form.setFieldValue('easyslipApiKey', '')
                }
            }
            fetchSetting()
        },
    })

    useEffect(() => {
        form.reset()
    }, [setting])

    return (
        <Card className="p-6 md:p-8" isLoading={isLoading}>
            <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                    {/* Left: label */}
                    <div className="w-full md:w-60 lg:w-64 shrink-0 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-(--core-grey-5) md:pr-6">
                        <h2 className="font-pixel text-2xl md:text-3xl text-(--core-white)">EasySlip</h2>
                        <p className="text-sm text-(--core-grey-3) mt-1.5 leading-relaxed">
                            จำเป็นต้องระบุ API Key ของ EasySlip เพื่อเปิดใช้งาน
                        </p>
                    </div>

                    {/* Right: form */}
                    <div className="flex-1 max-w-3xl">
                        <div className="pb-5 mb-5 border-b border-(--core-grey-5)">
                            <form.AppField
                                name="enableBank"
                                children={(field) => <field.CheckboxField variant='switch' label="เปิดใช้งาน ธนาคาร" tooltip="" disabled={!(setting as Setting)?.easyslipApiKey} />}
                            />
                        </div>
                        <div className="space-y-4 [&_label>span:first-child]:sm:w-44 [&_label>span:first-child]:sm:shrink-0">
                            <form.AppField
                                name="easyslipApiKey"
                                children={(field) => <field.TextField layout='horizontal' label="EasySlip API Key" placeholder='กรอก API Key' type="password" tooltip="ไปที่ https://easyslip.com เพื่อขอ API Key (มีค่าบริการตามการใช้งาน)" />}
                            />
                        </div>
                        <div className="flex justify-end pt-5 mt-5 border-t border-(--core-grey-5)">
                            <form.AppForm>
                                <form.SubmitButton>บันทึกการตั้งค่า</form.SubmitButton>
                            </form.AppForm>
                        </div>
                    </div>
                </div>
            </form>
        </Card>
    )
}

export default EasySlipSection