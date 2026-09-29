"use client"

import { updateServerSetting } from '@/app/actions/setting'
import { useAppForm } from '@/components/Form'
import Swal from '@/lib/Swal'
import React, { useMemo } from 'react'
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
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            {/* Left Column: Section Title & Info */}
            <div className="w-full md:w-60 lg:w-64 shrink-0 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-(--core-grey-5) md:pr-6">
                <h2 className="font-pixel text-2xl md:text-3xl text-(--core-white)">Server</h2>
                <p className="text-sm text-(--core-grey-3) mt-1.5 leading-relaxed">
                    ใช้สำหรับแสดงในหน้าแรก ส่วนของ About และสถานะเซิร์ฟเวอร์
                </p>
            </div>

            {/* Right Column: Form Fields */}
            <div className="flex-1 max-w-3xl">
                <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                    {/* Image select: vertical layout */}
                    <div className="pb-5 mb-5 border-b border-(--core-grey-5)">
                        <form.AppField
                            name="serverImageUrl"
                            children={(field) => (
                                <field.ImageSelectField
                                    label="Server Image (แนะนำขนาด 256x256)"
                                    group="brand"
                                />
                            )}
                        />
                    </div>

                    {/* Text fields: horizontal on sm+, vertical on mobile */}
                    <div className="space-y-4 [&_label>span:first-child]:sm:w-44 [&_label>span:first-child]:sm:shrink-0">
                        <form.AppField
                            name="serverName"
                            children={(field) => (
                                <field.TextField
                                    layout="horizontal"
                                    label="Server Name"
                                    placeholder="กรอกชื่อเซิร์ฟเวอร์"
                                    required
                                />
                            )}
                        />
                        <form.AppField
                            name="serverDesc"
                            children={(field) => (
                                <field.TextareaField
                                    layout="horizontal"
                                    label="Server Description"
                                    placeholder="กรอกคำอธิบายเซิร์ฟเวอร์"
                                    rows={3}
                                />
                            )}
                        />
                        <form.AppField
                            name="ip"
                            children={(field) => (
                                <field.TextField
                                    layout="horizontal"
                                    label="Server IP"
                                    placeholder="กรอก IP เซิร์ฟเวอร์"
                                    required
                                />
                            )}
                        />
                    </div>

                    <div className="flex justify-end pt-5 mt-5 border-t border-(--core-grey-5)">
                        <form.AppForm>
                            <form.SubmitButton>บันทึกการตั้งค่า</form.SubmitButton>
                        </form.AppForm>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ServerSection
