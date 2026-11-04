"use client"

import { updateSlipOk } from '@/app/actions/setting'
import { useSetting } from '@/app/contexts/settingContext'
import { Setting } from '@/app/generated/prisma/client'
import Card from '@/components/Card/Card'
import { useAppForm } from '@/components/Form'
import Swal from '@/lib/Swal'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { SlipOkFormValues, SlipOkSchema } from '../../schema'

const SlipOkSection: React.FC = () => {
    const { isLoading, fetchSetting, setting } = useSetting()

    const defaultValues = React.useMemo<SlipOkFormValues>(() => ({
        enableBank: setting?.enableBank ?? false,
        slipOkBranchId: (setting as Setting)?.slipOkBranchId ?? '',
        slipOkApiKey: (setting as Setting)?.slipOkApiKey ?? '',
        bank: (setting as Setting)?.bank ?? '',
        bankName: (setting as Setting)?.bankName ?? '',
        bankNumber: (setting as Setting)?.bankNumber ?? ''
    }), [setting])

    const form = useAppForm({
        defaultValues,
        validators: {
            onSubmit: SlipOkSchema,
        },
        onSubmit: async ({ value }: { value: SlipOkFormValues }) => {
            const confirm = await Swal.fire({
                icon: 'warning',
                title: 'ยืนยันการตั้งค่า SlipOk',
                text: 'โปรดตรวจสอบข้อมูลให้ถูกต้อง',
                showCancelButton: true,
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
            })
            if (!confirm.isConfirmed) return

            const res = await updateSlipOk(value)
            if (!res.success) {
                Swal.fire({ icon: 'error', title: res.error })
            } else {
                Swal.fire({ icon: 'success', title: 'บันทึกการตั้งค่าสำเร็จ' })
                if (!value.slipOkApiKey?.trim() || !value.slipOkBranchId?.trim()) {
                    form.setFieldValue('enableBank', false)
                    form.setFieldValue('slipOkBranchId', '')
                    form.setFieldValue('slipOkApiKey', '')
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
                        <h2 className="font-pixel text-2xl md:text-3xl text-(--core-white)"><a href="https://slipok.com" target='_blank' className='hover:text-(--core-green-4)'>SlipOk</a></h2>
                        <p className="text-sm text-(--core-grey-3) mt-1.5 leading-relaxed">
                            จำเป็นต้องระบุ Branch ID และ API Key ของ SlipOk เพื่อเปิดใช้งาน
                            โดยเปิดใช้บริการ https://slipok.com จากนั้นกรอก Branch ID (รหัสสาขา) และ Api Key
                        </p>
                    </div>

                    {/* Right: form */}
                    <div className="flex-1 max-w-3xl">
                        <div className="pb-5 mb-5 border-b border-(--core-grey-5)">
                            <form.Subscribe
                                selector={(state) => [
                                    state.values.slipOkBranchId,
                                    state.values.slipOkApiKey,
                                    state.values.bank,
                                    state.values.bankName,
                                    state.values.bankNumber,
                                ] as const}
                            >
                                {([branchId, apiKey, bank, bankName, bankNumber]) => (
                                    <form.AppField
                                        name="enableBank"
                                        children={(field) => (
                                            <field.CheckBoxField
                                                variant='switch'
                                                label="เปิดใช้งาน ธนาคาร"
                                                tooltip=""
                                                disabled={!field.state.value && ![branchId, apiKey, bank, bankName, bankNumber].every((value) => Boolean(value?.trim()))}
                                            />
                                        )}
                                    />
                                )}
                            </form.Subscribe>
                        </div>
                        <div className="space-y-4 [&_label>span:first-child]:sm:w-44 [&_label>span:first-child]:sm:shrink-0">
                            <form.AppField
                                name="slipOkBranchId"
                                children={(field) => <field.TextField layout='horizontal' label="Branch ID" placeholder='กรอก API Key' type="password" />}
                            />
                        </div>
                        <div className="space-y-4 [&_label>span:first-child]:sm:w-44 [&_label>span:first-child]:sm:shrink-0">
                            <form.AppField
                                name="slipOkApiKey"
                                children={(field) => <field.TextField layout='horizontal' label="API Key" placeholder='กรอก API Key' type="password" tooltip="ไปที่ https://slipok.com เพื่อขอ API Key (มีค่าบริการตามการใช้งาน)" />}
                            />
                        </div>
                        <div className="mt-6 border-t border-(--core-grey-5) pt-5">
                            <h3 className="font-semibold text-(--core-white)">ข้อมูลบัญชีธนาคาร</h3>
                            <p className="text-sm text-(--core-grey-3) mt-1 mb-4">ข้อมูลบัญชีที่แสดงให้ลูกค้าใช้สำหรับชำระเงิน</p>
                            <div className="space-y-4 [&_label>span:first-child]:sm:w-44 [&_label>span:first-child]:sm:shrink-0">
                                <form.AppField
                                    name="bank"
                                    children={(field) => <field.TextField layout='horizontal' label="ธนาคาร" placeholder='เช่น กสิกร' />}
                                />
                                <form.AppField
                                    name="bankName"
                                    children={(field) => <field.TextField layout='horizontal' label="ชื่อบัญชี" placeholder='ชื่อเจ้าของบัญชี' />}
                                />
                                <form.AppField
                                    name="bankNumber"
                                    children={(field) => <field.TextField layout='horizontal' label="เลขบัญชี" placeholder='กรอกเลขบัญชี' />}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-5 mt-5 border-t border-(--core-grey-5)">
                            <form.AppForm>
                                <form.SubmitButton>บันทึกการตั้งค่า</form.SubmitButton>
                            </form.AppForm>
                        </div>
                        <Image src={'/images/others/slipok-branch.png'} alt="SlipOk Secret Tutorial" width={800} height={700} className='w-full h-fit mt-6 mb-2' />
                        <span className=''>ไปที่ สาขา กำหนด<u>ช่องทางการตรวจสอบ</u>เป็น API Key คัดลอกรหัสใน API และ API Key มาใส่ที่ Easyshop</span>
                    </div>
                </div>
            </form>
        </Card>
    )
}

export default SlipOkSection
