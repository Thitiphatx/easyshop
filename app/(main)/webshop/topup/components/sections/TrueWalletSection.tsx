"use client"

import { updateTrueWalletSetting } from '@/app/actions/setting'
import { useSetting } from '@/app/contexts/settingContext'
import Card from '@/components/Card/Card'
import { useAppForm } from '@/components/Form'
import Swal from '@/lib/Swal'
import React, { useEffect, useMemo } from 'react'
import { TrueWalletFormValues, TrueWalletSchema } from '../../schema'

const TrueWalletSection: React.FC = () => {
    const { isLoading, fetchSetting, setting } = useSetting()

    const defaultValues = useMemo<TrueWalletFormValues>(() => ({
        enableTruewallet: setting?.enableTruewallet ?? false,
        truewalletPhoneNumber: setting?.truewalletPhoneNumber ?? '',
    }), [setting])

    const form = useAppForm({
        defaultValues,
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
                    form.setFieldValue('enableTruewallet', false)
                    form.setFieldValue('truewalletPhoneNumber', '')
                }
            }
            fetchSetting()
        },
    })

    useEffect(() => {
        form.reset()
    }, [form, setting])

    return (
        <Card className="p-6 md:p-8" isLoading={isLoading}>
            <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                    {/* Left: label */}
                    <div className="w-full md:w-60 lg:w-64 shrink-0 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-(--core-grey-5) md:pr-6">
                        <h2 className="font-pixel text-2xl md:text-3xl text-(--core-white)">True Wallet</h2>
                        <p className="text-sm text-(--core-grey-3) mt-1.5 leading-relaxed">
                            จำเป็นต้องระบุเบอร์โทรศัพท์ True Wallet เพื่อเปิดใช้งาน
                        </p>
                    </div>

                    {/* Right: form */}
                    <div className="flex-1 max-w-3xl">
                        <div className="pb-5 mb-5 border-b border-(--core-grey-5)">
                            <form.AppField
                                name="enableTruewallet"
                                children={(field) => <field.CheckboxField variant='switch' label="เปิดใช้งาน True Wallet" disabled={!setting?.truewalletPhoneNumber} />}
                            />
                        </div>
                        <div className="space-y-4 [&_label>span:first-child]:sm:w-44 [&_label>span:first-child]:sm:shrink-0">
                            <form.AppField
                                name="truewalletPhoneNumber"
                                children={(field) => <field.TextField label="เบอร์โทรศัพท์" layout='horizontal' placeholder='กรอกเบอร์โทรศัพท์' required />}
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

export default TrueWalletSection
