"use client"
import Card from '@/components/Card/Card'
import { useAppForm } from '@/components/Form'
import React, { useEffect, useMemo } from 'react'
import { PromotionFormValues, PromotionSchema } from '../../schema'
import Swal from '@/lib/Swal'
import { useSetting } from '@/app/contexts/settingContext'
import { updatePointMultiplier } from '@/app/actions/setting'

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
        {
            label: "x1",
            value: 1
        },
        {
            label: "x2",
            value: 2
        },
        {
            label: "x3",
            value: 3
        },
        {
            label: "x4",
            value: 4
        },
        {
            label: "x5",
            value: 5
        },
        {
            label: "x6",
            value: 6
        },
        {
            label: "x7",
            value: 7
        },
        {
            label: "x8",
            value: 8
        },
        {
            label: "x9",
            value: 9
        },
        {
            label: "x10",
            value: 10
        }
    ], [])

    return (
        <Card cardTitle={"Promotion"} isLoading={isLoading}>
            <form className='mt-6' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                <form.AppField
                    name="pointMultiplier"

                    children={(field) => <field.SelectField layout='horizontal' label="ตัวคูณการเติมพอยท์" placeholder='เลือกตัวคูณการเติมพอยท์' options={options} />}
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

export default PromotionSection