'use client'

import React from 'react'
import { useAppForm } from '@/components/Form'
import { ServerFormValues, ServerSchema } from '@/app/(main)/webshop/setting/schema'
import { ISetupServer } from '@/app/actions/setup/interface'
import Button from '@/components/Button/Button'
import { ChevronLeft, ChevronRight, Server } from 'pixelarticons/react'

interface IServerStepProps {
    data: ISetupServer
    onBack: () => void
    onNext: (values: ISetupServer) => void
}

export const ServerStep: React.FC<IServerStepProps> = ({ data, onBack, onNext }) => {
    const form = useAppForm({
        defaultValues: {
            serverName: data.serverName || '',
            serverDesc: data.serverDesc || '',
            ip: data.serverIp || '',
            serverImageUrl: data.serverImageUrl || '',
        } as ServerFormValues,
        validators: {
            onSubmit: ServerSchema,
        },
        onSubmit: async ({ value }: { value: ServerFormValues }) => {
            onNext({
                serverName: value.serverName,
                serverDesc: value.serverDesc,
                serverIp: value.ip,
                serverImageUrl: value.serverImageUrl,
            })
        },
    })

    return (
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            {/* Left Column: Section Info */}
            <div className="w-full md:w-60 lg:w-64 shrink-0 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-(--core-grey-5) md:pr-6">
                <div className="flex items-center gap-2 text-(--core-gold-3) mb-1">
                    <Server className="size-6" />
                    <span className="font-pixel text-xs tracking-wider">STEP 2</span>
                </div>
                <h2 className="font-pixel text-2xl md:text-3xl text-(--core-white)">Server</h2>
                <p className="text-sm text-(--core-grey-3) mt-2 leading-relaxed">
                    ข้อมูลเซิร์ฟเวอร์หลัก ใช้สำหรับแสดงสถานะออนไลน์ จำนวนผู้เล่น และการเชื่อมต่อในหน้าเว็บ
                </p>
            </div>

            {/* Right Column: Form Fields */}
            <div className="flex-1 max-w-3xl">
                <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                    {/* Server Image Select */}
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

                    {/* Text fields */}
                    <div className="space-y-4 [&_label>span:first-child]:sm:w-44 [&_label>span:first-child]:sm:shrink-0">
                        <form.AppField
                            name="serverName"
                            children={(field) => (
                                <field.TextField
                                    layout="horizontal"
                                    label="Server Name"
                                    placeholder="กรอกชื่อเซิร์ฟเวอร์ (เช่น MyMinecraft Server)"
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
                                    placeholder="กรอก IP หรือ Domain เซิร์ฟเวอร์ (เช่น play.myserver.net)"
                                    required
                                />
                            )}
                        />
                    </div>

                    <div className="flex justify-between items-center pt-6 mt-6 border-t border-(--core-grey-5)">
                        <Button
                            type="button"
                            color="Default"
                            onClick={onBack}
                            className="flex items-center gap-2"
                        >
                            <ChevronLeft className="size-5" />
                            <span>ย้อนกลับ</span>
                        </Button>

                        <form.AppForm>
                            <form.SubmitButton color="Green" className="flex items-center gap-2">
                                <span>ถัดไป: ระบบเติมเงิน</span>
                                <ChevronRight className="size-5" />
                            </form.SubmitButton>
                        </form.AppForm>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ServerStep
