'use client'

import React from 'react'
import { useAppForm } from '@/components/Form'
import { DisplayFormValues, DisplaySchema } from '@/app/(main)/webshop/setting/schema'
import { ChevronRight, Store } from 'pixelarticons/react'
import { IWebshopStepProps } from '../interface'

export const WebshopStep: React.FC<IWebshopStepProps> = ({ data, onNext }) => {
    const form = useAppForm({
        defaultValues: {
            siteName: data.siteName || '',
            siteDesc: data.siteDesc || '',
            logo: data.logo || '',
        } as DisplayFormValues,
        validators: {
            onSubmit: DisplaySchema,
        },
        onSubmit: async ({ value }: { value: DisplayFormValues }) => {
            onNext({
                siteName: value.siteName,
                siteDesc: value.siteDesc,
                logo: value.logo,
            })
        },
    })

    return (
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            {/* Left Column: Section Info */}
            <div className="w-full md:w-60 lg:w-64 shrink-0 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-(--core-grey-5) md:pr-6">
                <div className="flex items-center gap-2 text-(--core-gold-3) mb-1">
                    <Store className="size-6" />
                    <span className="font-pixel text-xs tracking-wider">STEP 1</span>
                </div>
                <h2 className="font-pixel text-2xl md:text-3xl text-(--core-white)">Webshop</h2>
                <p className="text-sm text-(--core-grey-3) mt-2 leading-relaxed">
                    ตั้งค่าข้อมูลทั่วไปของร้านค้าของคุณ เช่น โลโก้ ชื่อร้านค้า และคำอธิบาย
                </p>
            </div>

            {/* Right Column: Form Fields */}
            <div className="flex-1 max-w-3xl">
                <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                    {/* Logo Image Select */}
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

                    {/* Text fields */}
                    <div className="space-y-4 [&_label>span:first-child]:sm:w-44 [&_label>span:first-child]:sm:shrink-0">
                        <form.AppField
                            name="siteName"
                            children={(field) => (
                                <field.TextField
                                    layout="horizontal"
                                    label="Webshop Name"
                                    placeholder="กรอกชื่อของเว็บช็อป (เช่น Easyshop)"
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
                                    placeholder="กรอกคำอธิบายร้านค้าสั้นๆ"
                                    rows={3}
                                />
                            )}
                        />
                    </div>

                    <div className="flex justify-end pt-6 mt-6 border-t border-(--core-grey-5)">
                        <form.AppForm>
                            <form.SubmitButton color="Green" className="flex items-center gap-2">
                                <span>ถัดไป: ตั้งค่าเซิร์ฟเวอร์</span>
                                <ChevronRight className="size-5" />
                            </form.SubmitButton>
                        </form.AppForm>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default WebshopStep
