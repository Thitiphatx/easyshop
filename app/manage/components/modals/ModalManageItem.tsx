"use client"
import Modal from '@/components/Modal/Modal'
import React, { useEffect } from 'react'
import { IModalServerProps } from '../../interface'
import { useAppForm } from '@/components/Form'
import { ServerSchema } from './schema'

const ModalManageItem: React.FC<IModalServerProps> = ({
    isOpen,
    setIsOpen,
    isEdit,
    serverInfo
}) => {

    const form = useAppForm({
        defaultValues: {
            rconHost: '',
            rconPort: 0,
            rconPassword: '',
            name: '',
            imageUrl: ''
        },
        validators: {
            onChange: ServerSchema,
            onSubmit: ServerSchema
        },
        onSubmit: async ({ value }) => console.log(value),
    })

    useEffect(() => {
        form.reset()
    }, [isOpen])

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            modalTitle={isEdit ? serverInfo?.name : "Add New Server"}
        >
            <form className='mt-6' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                <form.AppField
                    name="rconHost"
                    children={(field) => <field.TextField label="IP Address" placeholder='กรอกที่อยู่เซิร์ฟเวอร์' required />}
                />
                <form.AppField
                    name="rconPort"
                    children={(field) => <field.TextField label="Port" placeholder='กรอกพอร์ตเซิร์ฟเวอร์' required />}
                />
                <form.AppField
                    name="name"
                    children={(field) => <field.TextField label="Name" placeholder='กรอกชื่อเซิร์ฟเวอร์ที่ใช้แสดง' required />}
                />
                <div className='flex justify-center'>
                    <form.AppForm>
                        <form.SubmitButton block>{isEdit ? "บันทึก" : "เพิ่มเซิร์ฟเวอร์"}</form.SubmitButton>
                    </form.AppForm>
                </div>
            </form>
        </Modal>
    )
}

export default ModalManageItem