"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Card from '@/components/Card/Card'
import { DisplayFormValues, DisplaySchema } from '../../schema'
import { useAppForm } from '@/components/Form'
import { IDisplaySetting } from '@/app/actions/setting/interface'
import Swal from '@/lib/Swal'
import { getSetting, upsertDisplaySetting } from '@/app/actions/setting'
import { displaySettingSelect } from '@/app/actions/setting/interface'
import Loading from '@/components/Loading'

const DisplaySection: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [displayInfo, setDisplayInfo] = useState<IDisplaySetting>()

    const defaultValues = useMemo<DisplayFormValues>(() => ({
        siteName: displayInfo?.siteName || '',
        favicon: displayInfo?.favicon || '',
        logo: displayInfo?.logo || '',
    }), [displayInfo])

    const form = useAppForm({
        defaultValues,
        validators: {
            onSubmit: DisplaySchema,
        },
        onSubmit: async ({ value }: { value: DisplayFormValues }) => {
            const res = await upsertDisplaySetting(value)
            if (!res.success) {
                Swal.fire({ icon: 'error', title: res.error, theme: 'dark' })
            } else {
                Swal.fire({ icon: 'success', title: 'บันทึกการตั้งค่าเรียบร้อยแล้ว', theme: 'dark' })
            }
            fetchDisplayInfo()
        },
    })

    const fetchDisplayInfo = useCallback(async () => {
        setIsLoading(true)
        const res = await getSetting(displaySettingSelect)
        if (res.success && res.data) {
            setDisplayInfo(res.data)
        }
        setIsLoading(false)
    }, [])

    useEffect(() => {
        fetchDisplayInfo()
    }, [fetchDisplayInfo])

    return (
        <Card cardTitle="Display" className='h-fit'>
            {isLoading ? (
                <div className='flex justify-center py-8'><Loading /></div>
            ) : (
                <form className='mt-6' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                    <form.AppField
                        name="logo"
                        children={(field) => <field.ImageSelectField label="Logo (แนะนำขนาด 300x50)" group="brand" required />}
                    />
                    <form.AppField
                        name="favicon"
                        children={(field) => <field.ImageSelectField label="FavIcon" group="brand" required />}
                    />
                    <form.AppField
                        name="siteName"
                        children={(field) => <field.TextField label="Site Name" placeholder='กรอกชื่อของเว็บช็อป' required />}
                    />
                    <form.AppForm>
                        <form.SubmitButton block>บันทึก</form.SubmitButton>
                    </form.AppForm>
                </form>
            )}
        </Card>
    )
}

export default DisplaySection
