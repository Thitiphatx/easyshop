"use client"

import { updateDisplaySetting } from '@/app/actions/setting'
import Card from '@/components/Card/Card'
import { useAppForm } from '@/components/Form'
import Loading from '@/components/Loading'
import Swal from '@/lib/Swal'
import React, { useMemo, useState } from 'react'
import { DisplayFormValues, DisplaySchema } from '../../schema'
import { useSetting } from '@/app/contexts/settingContext'

const DisplaySection: React.FC = () => {
    const { setting, fetchSetting } = useSetting()

    const defaultValues = useMemo<DisplayFormValues>(() => ({
        siteName: setting?.siteName || '',
        siteDesc: setting?.siteDesc || '',
        logo: setting?.logo || '',
    }), [setting])

    const form = useAppForm({
        defaultValues,
        validators: {
            onSubmit: DisplaySchema,
        },
        onSubmit: async ({ value }: { value: DisplayFormValues }) => {
            const res = await updateDisplaySetting(value)
            if (!res.success) {
                Swal.fire({ icon: 'error', title: res.error })
            } else {
                Swal.fire({ icon: 'success', title: 'บันทึกการตั้งค่าเรียบร้อยแล้ว' })
                await fetchSetting()
            }
        },
    })

    return (
        <Card cardTitle="Display" className='h-fit'>
            <form className='mt-6' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                <form.AppField
                    name="logo"
                    children={(field) => <field.ImageSelectField label="Logo (แนะนำขนาด 300x50)" group="brand" />}
                />
                <form.AppField
                    name="siteName"
                    children={(field) => <field.TextField label="Webshop Name" placeholder='กรอกชื่อของเว็บช็อป' required />}
                />
                <form.AppField
                    name="siteDesc"
                    children={(field) => <field.TextField label="Webshop Description" placeholder='กรอกรายละเอียดของเว็บช็อป' />}
                />
                <form.AppForm>
                    <form.SubmitButton block>บันทึก</form.SubmitButton>
                </form.AppForm>
            </form>
        </Card>
    )
}

export default DisplaySection
