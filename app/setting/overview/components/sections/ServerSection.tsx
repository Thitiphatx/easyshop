"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Card from '@/components/Card/Card'
import { useAppForm } from '@/components/Form'
import { ServerFormValues, ServerSchema } from '../../schema'
import { getSetting, upsertServerSetting } from '@/app/actions/setting'
import { IServerSetting, serverSettingSelect } from '@/app/actions/setting/interface'
import Swal from '@/lib/Swal'
import Loading from '@/components/Loading'

const ServerSection: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [serverInfo, setServerInfo] = useState<IServerSetting>()

    const defaultValues = useMemo<ServerFormValues>(() => ({
        serverName: serverInfo?.serverName || '',
        ip: serverInfo?.serverIp || '',
    }), [serverInfo])

    const form = useAppForm({
        defaultValues,
        validators: {
            onSubmit: ServerSchema,
        },
        onSubmit: async ({ value }: { value: ServerFormValues }) => {
            const res = await upsertServerSetting(value)
            if (!res.success) {
                Swal.fire({ icon: 'error', title: res.error, theme: 'dark' })
            } else {
                Swal.fire({ icon: 'success', title: 'บันทึกการตั้งค่าเรียบร้อยแล้ว', theme: 'dark' })
            }
            fetchServerInfo()
        },
    })

    const fetchServerInfo = useCallback(async () => {
        setIsLoading(true)
        const res = await getSetting(serverSettingSelect)
        if (res.success && res.data) {
            setServerInfo(res.data)
        }
        setIsLoading(false)
    }, [])

    useEffect(() => {
        fetchServerInfo()
    }, [fetchServerInfo])

    return (
        <Card cardTitle="Server" className='h-fit'>
            <h1>ใช้สำหรับแสดงในหน้าแรก</h1>
            {isLoading ? (
                <div className='flex justify-center py-8'><Loading /></div>
            ) : (
                <form className='mt-6' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                    <form.AppField
                        name="serverName"
                        children={(field) => <field.TextField label="Server Name" placeholder='กรอกชื่อเซิร์ฟเวอร์' required />}
                    />
                    <form.AppField
                        name="ip"
                        children={(field) => <field.TextField label="Server IP" placeholder='กรอก IP เซิร์ฟเวอร์' required />}
                    />
                    <form.AppForm>
                        <form.SubmitButton block>บันทึก</form.SubmitButton>
                    </form.AppForm>
                </form>
            )}
        </Card>
    )
}

export default ServerSection
