"use client"

import { updateServerSetting } from '@/app/actions/setting'
import Card from '@/components/Card/Card'
import { useAppForm } from '@/components/Form'
import Loading from '@/components/Loading'
import Swal from '@/lib/Swal'
import React, { useMemo, useState } from 'react'
import { ServerFormValues, ServerSchema } from '../../schema'
import { useSetting } from '@/app/contexts/settingContext'

const ServerSection: React.FC = () => {
    const { setting, fetchSetting } = useSetting()

    const defaultValues = useMemo<ServerFormValues>(() => ({
        serverImageUrl: setting?.serverImageUrl || '',
        serverName: setting?.serverName || '',
        serverDesc: setting?.serverDesc || '',
        ip: setting?.serverIp || '',
    }), [setting])

    const form = useAppForm({
        defaultValues,
        validators: {
            onSubmit: ServerSchema,
        },
        onSubmit: async ({ value }: { value: ServerFormValues }) => {
            const res = await updateServerSetting(value)
            if (!res.success) {
                Swal.fire({ icon: 'error', title: res.error, theme: 'dark' })
            } else {
                Swal.fire({ icon: 'success', title: 'บันทึกการตั้งค่าเรียบร้อยแล้ว', theme: 'dark' })
                await fetchSetting()
            }
        },
    })

    return (
        <Card cardTitle="Server" className='h-fit'>
            <h1>ใช้สำหรับแสดงในหน้าแรก ส่วนของ About</h1>
            <form className='mt-6' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                <form.AppField
                    name="serverImageUrl"
                    children={(field) => <field.ImageSelectField label="Server Image (แนะนำขนาด 256x256)" group="brand" />}
                />
                <form.AppField
                    name="serverName"
                    children={(field) => <field.TextField label="Server Name" placeholder='กรอกชื่อเซิร์ฟเวอร์' required />}
                />
                <form.AppField
                    name="serverDesc"
                    children={(field) => <field.TextField label="Server Description" placeholder='กรอกคำอธิบายเซิร์ฟเวอร์' />}
                />
                <form.AppField
                    name="ip"
                    children={(field) => <field.TextField label="Server IP" placeholder='กรอก IP เซิร์ฟเวอร์' required />}
                />
                <form.AppForm>
                    <form.SubmitButton block>บันทึก</form.SubmitButton>
                </form.AppForm>
            </form>
        </Card>
    )
}

export default ServerSection
