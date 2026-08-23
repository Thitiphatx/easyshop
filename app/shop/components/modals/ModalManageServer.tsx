"use client"
import { createServer, updateServer } from '@/app/actions/server'
import { useAppForm } from '@/components/Form'
import Modal from '@/components/Modal/Modal'
import { Image, Server } from 'pixelarticons/react'
import React, { useEffect, useMemo } from 'react'
import Swal from '@/lib/Swal'
import { IModalServerProps } from '../../interface'
import { ServerFormValues, ServerSchema } from './schema'

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
        imageUrl: (isEdit && serverInfo ? serverInfo.imageUrl : '') as string,
    }), [isEdit, serverInfo])

    const form = useAppForm({
        defaultValues,
        validators: {
            onSubmit: ServerSchema,
        },
        onSubmit: async ({ value }: { value: ServerFormValues }) => {
            if (isEdit && serverInfo) {
                const res = await updateServer({ ...serverInfo, ...value, id: Number(serverInfo.id) })
            } else {
                const res = await createServer(value)
                if (!res.success || !res.data) {
                    Swal.fire({
                        icon: 'error',
                        title: res.error,
                        theme: 'dark',
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: "สำเร็จ",
                        theme: 'dark',
                    });
                }
            }
            getServerList()
            setIsOpen(false)
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
                            name="imageUrl"
                            children={(field) => <field.ImageSelectField label="รูปภาพเซิร์ฟเวอร์" group="server" required />}
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