"use client"

import { updateDisplaySetting } from '@/app/actions/setting'
import { useAppForm } from '@/components/Form'
import Swal from '@/lib/Swal'
import React, { useMemo } from 'react'
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
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            {/* Left Column: Section Title & Info */}
            <div className="w-full md:w-60 lg:w-64 shrink-0 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-(--core-grey-5) md:pr-6">
                <h2 className="font-pixel text-2xl md:text-3xl text-(--core-white)">Display</h2>
                <p className="text-sm text-(--core-grey-3) mt-1.5 leading-relaxed">
                    ข้อมูลทั่วไปและการแสดงผลของร้านค้า เช่น โลโก้ และคำอธิบาย
                </p>
            </div>

            {/* Right Column: Form Fields */}
            <div className="flex-1 max-w-3xl">
                <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                    {/* Image select: vertical layout */}
                    <div className="pb-5 mb-5 border-b border-(--core-grey-5)">
                        <form.AppField
                            name="logo"
                            children={(field) => (
                                <field.ImageSelectField
                                    label="Logo ร้านค้า (แนะนำขนาด 300x50)"
                                    group="brand"
                                />
                            )}
                        />
                    </div>

                    {/* Text fields: horizontal on sm+, vertical on mobile */}
                    <div className="space-y-4 [&_label>span:first-child]:sm:w-44 [&_label>span:first-child]:sm:shrink-0">
                        <form.AppField
                            name="siteName"
                            children={(field) => (
                                <field.TextField
                                    layout="horizontal"
                                    label="Webshop Name"
                                    placeholder="กรอกชื่อของเว็บช็อป"
                                    required
                                />
                            )}
                        />
                        <form.AppField
                            name="siteDesc"
                            children={(field) => (
                                <field.TextareaField
                                    layout="horizontal"
                                    label="Webshop Description"
                                    placeholder="กรอกรายละเอียดของเว็บช็อป"
                                    rows={3}
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

export default DisplaySection
