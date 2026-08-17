"use client"
import Modal from '@/components/Modal/Modal'
import React, { useMemo } from 'react'
import { IModalServerProps } from '../../interface'
import { useAppForm } from '@/components/Form'
import { ServerFormValues, ServerSchema } from './schema'
import { uploadImage } from '@/app/actions/image'
import { createServer, updateServer } from '@/app/actions/server'

const ModalManageServer: React.FC<IModalServerProps> = ({
    isOpen,
    setIsOpen,
    isEdit,
    serverInfo,
}) => {

    const defaultValues = useMemo<ServerFormValues>(() => ({
        rconHost: isEdit && serverInfo ? serverInfo.rconHost : '',
        rconPort: isEdit && serverInfo ? serverInfo.rconPort : '',
        rconPassword: isEdit && serverInfo ? serverInfo.rconPassword : '',
        name: isEdit && serverInfo ? serverInfo.name : '',
        imageFile: null,
    }), [isEdit, serverInfo])

    const form = useAppForm({
        defaultValues,
        validators: {
            onChange: ServerSchema,
            onSubmit: ServerSchema,
        },
        onSubmit: async ({ value }: { value: ServerFormValues }) => {
            if (!value.imageFile) return

            // 1. Upload image → get URL
            const fd = new FormData()
            fd.append('file', value.imageFile)
            const uploadResult = await uploadImage(fd, 'server')

            if (!uploadResult.success) {
                console.error('Upload failed:', uploadResult.error)
                return
            }

            const payload = {
                rconHost: value.rconHost,
                rconPort: value.rconPort,
                rconPassword: value.rconPassword,
                name: value.name,
                imageUrl: uploadResult.url,
                isActive: serverInfo?.isActive ?? true,
            }

            // 2. Call the correct action based on mode
            if (isEdit && serverInfo) {
                await updateServer({ ...serverInfo, ...payload, id: Number(serverInfo.id) })
            } else {
                await createServer(payload)
            }

            setIsOpen(false)
        },
    })

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            modalTitle={isEdit ? `แก้ไข: ${serverInfo?.name}` : 'Add New Server'}
        >
            <form className='mt-6' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                <div>
                    <p>Rcon</p>
                    <form.AppField
                        name="rconHost"
                        children={(field) => <field.TextField label="RCON IP Address" placeholder='กรอกที่อยู่เซิร์ฟเวอร์' required />}
                    />
                    <form.AppField
                        name="rconPort"
                        children={(field) => <field.TextField label="RCON Port" placeholder='กรอกพอร์ต Rcon' required />}
                    />
                    <form.AppField
                        name="rconPassword"
                        children={(field) => <field.TextField label="RCON Password" placeholder='กรอกรหัสผ่าน Rcon' type='password' required />}
                    />
                </div>
                <form.AppField
                    name="name"
                    children={(field) => <field.TextField label="Server Name" placeholder='กรอกชื่อเซิร์ฟเวอร์ที่ใช้แสดง' required />}
                />
                <form.AppField
                    name="imageFile"
                    children={(field) => <field.FileField label="รูปภาพเซิร์ฟเวอร์" accept="image/*" required />}
                />
                <div className='flex justify-center'>
                    <form.AppForm>
                        <form.SubmitButton block>{isEdit ? 'บันทึก' : 'เพิ่มเซิร์ฟเวอร์'}</form.SubmitButton>
                    </form.AppForm>
                </div>
            </form>
        </Modal>
    )
}

export default ModalManageServer