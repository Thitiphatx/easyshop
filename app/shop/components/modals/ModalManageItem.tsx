"use client"
import { createServer, updateServer } from '@/app/actions/server'
import { useAppForm } from '@/components/Form'
import Modal from '@/components/Modal/Modal'
import { Image } from 'pixelarticons/react'
import React, { useEffect, useMemo } from 'react'
import Swal from '@/lib/Swal'
import { IModalItemProps } from '../../interface'
import { ItemFormValues, ItemSchema } from './schema'
import { createItem, updateItem } from '@/app/actions/item'

const ModalManageItem: React.FC<IModalItemProps> = ({
    isOpen,
    setIsOpen,
    isEdit,
    itemInfo,
    getItemList,
    serverId
}) => {

    const defaultValues = useMemo<ItemFormValues>(() => ({
        name: isEdit && itemInfo ? itemInfo.name : '',
        description: isEdit && itemInfo ? itemInfo.description : '',
        imageUrl: isEdit && itemInfo ? itemInfo.imageUrl : '',
        command: isEdit && itemInfo ? itemInfo.command : '',
        price: isEdit && itemInfo ? itemInfo.price : '0',
        amount: isEdit && itemInfo?.amount ? itemInfo.amount : '0',
        category: isEdit && itemInfo ? itemInfo.category : ''
    }), [isEdit])

    const form = useAppForm({
        defaultValues,
        validators: {
            onSubmit: ItemSchema,
        },
        onSubmit: async ({ value }: { value: ItemFormValues }) => {
            if (isEdit && itemInfo) {
                const res = await updateItem({ ...itemInfo, ...value })
            } else {
                const res = await createItem(value, serverId)
                if (!res.success || !res.data) {
                    Swal.fire({
                        icon: 'error',
                        title: res.error,
                        theme: 'dark',
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: "สร้างไอเท็มใหม่เรียบร้อยแล้ว",
                        theme: 'dark',
                    });
                }
            }
            getItemList()
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
                isEdit && itemInfo ?
                    <div className='flex gap-4'>
                        <h1>
                            แก้ไขไอเทม
                        </h1>
                    </div>
                    : 'Add New Item'}
        >
            <form className='mt-6' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                <div>
                    <div className='flex items-center gap-2'>
                        <Image className='text-(--core-green-3)' />
                        <h5 className='font-bold'>ข้อมูลไอเท็ม</h5>
                    </div>
                    <div className='p-4'>
                        <form.AppField
                            name="imageUrl"
                            children={(field) => <field.ImageSelectField label="รูปภาพไอเท็ม" group="item" required />}
                        />
                        <form.AppField
                            name="name"
                            children={(field) => <field.TextField label="Item Name" placeholder='กรอกชื่อไอเท็มที่ใช้แสดง' required />}
                        />
                        <form.AppField
                            name="description"
                            children={(field) => <field.TextField label="Description" placeholder='กรอกรายละเอียดไอเท็ม' />}
                        />
                        <form.AppField
                            name="category"
                            children={(field) => <field.TextField label="Category" placeholder='กรอกประเภทสินค้า' required />}
                        />
                        <form.AppField
                            name="price"
                            children={(field) => <field.TextField label="Price" placeholder='กรอกราคา' type='number' min={1} required />}
                        />
                    </div>
                </div>
                <div>
                    <div className='flex items-center gap-2'>
                        <Image className='text-(--core-green-3)' />
                        <h5 className='font-bold'>คำสั่ง</h5>
                    </div>
                    <div className='p-4'>
                        <form.AppField
                            name="command"
                            children={(field) => <field.TextField label="Command" placeholder='กรอกคำสั่งเสกไอเท็ม' tooltip={
                                <div>
                                    <p className='font-bold'>กรอกคำสั่งเสกไอเท็มบนเซิร์ฟเวอร์</p>
                                    <p><span className='text-(--core-green-6)'>%player%</span> - แทนชื่อของผู้เล่น</p>
                                    <p><span className='text-(--core-green-6)'>%quantity%</span> - แทนจำนวนไอเท็ม</p>
                                    <p className='mt-2 font-bold'>ตัวอย่าง (ไม่ต้องมี /)</p>
                                    <p className='text-(--core-green-6)'>give %player% diamond %quantity%</p>
                                    <p className='text-(--core-green-6)'>lp user %player% parent addtemp vip 7d</p>
                                </div>
                            } required />}
                        />
                        <form.AppField
                            name="amount"
                            children={(field) => <field.TextField label="Amount" placeholder='กรอกจำนวนครั้งการรันคำสั่ง' type='number' min={1} tooltip={"จำนวนตรงนี้จะไปแทน %quantity% ในคำสั่ง"} required />}
                        />
                    </div>
                </div>
                <div className='flex justify-center'>
                    <form.AppForm>
                        <form.SubmitButton block>{isEdit ? 'บันทึก' : 'เพิ่มไอเท็ม'}</form.SubmitButton>
                    </form.AppForm>
                </div>
            </form>
        </Modal>
    )
}

export default ModalManageItem