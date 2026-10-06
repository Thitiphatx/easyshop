"use client"
import { updatePointMultiplier } from '@/app/actions/setting'
import { useSetting } from '@/app/contexts/settingContext'
import Card from '@/components/Card/Card'
import { useAppForm } from '@/components/Form'
import Swal from '@/lib/Swal'
import React, { useMemo } from 'react'
import { PromotionFormValues, PromotionSchema } from '../../schema'

const PromotionSection: React.FC = () => {
    const { isLoading, fetchSetting, setting } = useSetting()

    const form = useAppForm({
        defaultValues: {
            pointMultiplier: setting?.pointMultiplier ?? 1,
        } as PromotionFormValues,
        validators: {
            onSubmit: PromotionSchema,
        },
        onSubmit: async ({ value }: { value: PromotionFormValues }) => {
            const confirm = await Swal.fire({
                icon: 'warning',
                title: 'ยืนยันการตั้งค่า Promotion',
                text: 'ผู้เล่นที่เติมเงินหลังจากกดยืนยัน จะใช้ตัวคูณการเติมพอยท์ตามที่ตั้งค่าไว้ทันที',
                showCancelButton: true,
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
            })
            if (!confirm.isConfirmed) return

            const res = await updatePointMultiplier(value)
            if (!res.success) {
                Swal.fire({ icon: 'error', title: res.error })
            } else {
                Swal.fire({ icon: 'success', title: 'อัปเดตตัวคูณการเติมพอยท์เรียบร้อยแล้ว' })
            }
            fetchSetting()
        },
    })

    const options = useMemo(() => [
        { label: "x1", value: 1 },
        { label: "x2", value: 2 },
        { label: "x3", value: 3 },
        { label: "x4", value: 4 },
        { label: "x5", value: 5 },
        { label: "x6", value: 6 },
        { label: "x7", value: 7 },
        { label: "x8", value: 8 },
        { label: "x9", value: 9 },
        { label: "x10", value: 10 },
    ], [])

    return (
        <Card className="p-6 md:p-8" isLoading={isLoading}>
            <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                    {/* Left: label */}
                    <div className="w-full md:w-60 lg:w-64 shrink-0 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-(--core-grey-5) md:pr-6">
                        <h2 className="font-pixel text-2xl md:text-3xl text-(--core-white)">Promotion</h2>
                        <p className="text-sm text-(--core-grey-3) mt-1.5 leading-relaxed">
                            กำหนดตัวคูณการเติมพอยท์ ผู้เล่นที่จะได้รับพอยท์เพิ่มขึ้น
                        </p>
                    </div>

                    {/* Right: form */}
                    <div className="flex-1 max-w-3xl">
                        <div className="space-y-4 [&_label>span:first-child]:sm:w-44 [&_label>span:first-child]:sm:shrink-0">
                            <form.AppField
                                name="pointMultiplier"
                                children={(field) => <field.SelectField layout='horizontal' label="ตัวคูณการเติมพอยท์" placeholder='เลือกตัวคูณการเติมพอยท์' options={options} />}
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

export default PromotionSection