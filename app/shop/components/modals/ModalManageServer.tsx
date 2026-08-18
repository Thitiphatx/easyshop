"use client"
import { uploadImage } from '@/app/actions/image'
import { createServer, deleteServer, updateServer } from '@/app/actions/server'
import { useAppForm } from '@/components/Form'
import Modal from '@/components/Modal/Modal'
import { Image, Server, Trash } from 'pixelarticons/react'
import React, { useCallback, useEffect, useMemo } from 'react'
import { IModalServerProps } from '../../interface'
import { ServerFormValues, ServerSchema } from './schema'
import Button from '@/components/Button/Button'
import Swal from 'sweetalert2'

const ModalManageServer: React.FC<IModalServerProps> = ({
    isOpen,
    setIsOpen,
    isEdit,
    serverInfo,
    getServerList
}) => {

    const defaultValues = useMemo<ServerFormValues>(() => ({
        rconHost: isEdit && serverInfo ? serverInfo.rconHost : '',
        rconPort: isEdit && serverInfo ? serverInfo.rconPort : '',
        rconPassword: isEdit && serverInfo ? serverInfo.rconPassword : '',
        name: isEdit && serverInfo ? serverInfo.name : '',
        subtitle: isEdit && serverInfo ? serverInfo.subtitle : '',
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
                subtitle: value.subtitle,
                imageUrl: uploadResult.url,
            }

            // 2. Call the correct action based on mode
            if (isEdit && serverInfo) {
                await updateServer({ ...serverInfo, ...payload, id: Number(serverInfo.id) })
            } else {
                await createServer(payload)
            }
            getServerList()
            setIsOpen(false)

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: "สำเร็จ",
                theme: 'dark',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
        },
    })

    useEffect(() => {
        if (!isOpen) {
            form.reset()
        }
    }, [isOpen])

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            modalTitle={
                isEdit && serverInfo ?
                    <div className='flex gap-4'>
                        <h1>
                            แก้ไขเซิร์ฟเวอร์
                        </h1>
                    </div>
                    : 'Add New Server'}


        >
            <form className='mt-6' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                <div>
                    <div className='flex items-center gap-2'>
                        <Image className='text-(--core-green-3)' />
                        <h5 className='font-bold'>ข้อมูลเซิร์ฟเวอร์</h5>
                    </div>
                    <div className='p-4'>
                        <form.AppField
                            name="imageFile"
                            children={(field) => <field.FileField label="รูปภาพเซิร์ฟเวอร์" accept="image/*" required />}
                        />
                        <form.AppField
                            name="name"
                            children={(field) => <field.TextField label="Server Name" placeholder='กรอกชื่อเซิร์ฟเวอร์ที่ใช้แสดง' required />}
                        />
                        <form.AppField
                            name="subtitle"
                            children={(field) => <field.TextField label="Sub Name" placeholder='กรอกรายละเอียดสั้นๆ (เวอร์ชั่น, แนว)' />}
                        />
                    </div>
                </div>
                <div>
                    <div className='flex items-center gap-2'>
                        <Server className='text-(--core-green-3)' />
                        <h5 className='font-bold'>การเชื่อมต่อ</h5>
                    </div>
                    <div className='p-4'>
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
                </div>
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