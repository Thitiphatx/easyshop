"use client"
import React, { useEffect } from 'react'
import Modal from '@/components/Modal/Modal'
import { useAppForm } from '@/components/Form'
import { BannerFormValues, BannerSchema } from '../../schema'
import { IModalBannerProps } from '../../interface'
import { createBanner } from '@/app/actions/banner'
import Swal from '@/lib/Swal'

const ModalManageBanner: React.FC<IModalBannerProps> = ({ isOpen, setIsOpen, getBannerList }) => {
    const form = useAppForm({
        defaultValues: {
            imageUrl: '',
            link: '',
        } as BannerFormValues,
        validators: {
            onSubmit: BannerSchema,
        },
        onSubmit: async ({ value }: { value: BannerFormValues }) => {
            const res = await createBanner({ imageUrl: value.imageUrl, link: value.link || undefined })
            if (!res.success) {
                Swal.fire({ icon: 'error', title: res.error, theme: 'dark' })
            } else {
                Swal.fire({ icon: 'success', title: 'เพิ่ม Banner เรียบร้อยแล้ว', theme: 'dark' })
                getBannerList()
                setIsOpen(false)
            }
        },
    })

    useEffect(() => {
        if (!isOpen) form.reset()
    }, [isOpen])

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} modalTitle="เพิ่ม Banner">
            <form className='mt-6' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                <form.AppField
                    name="imageUrl"
                    children={(field) => <field.ImageSelectField label="รูปภาพ Banner" group="banner" required />}
                />
                <form.AppField
                    name="link"
                    children={(field) => <field.TextField label="Link" placeholder='กรอก URL ที่ต้องการลิ้งค์เมื่อกด' />}
                />
                <div className='flex justify-center'>
                    <form.AppForm>
                        <form.SubmitButton block>เพิ่ม Banner</form.SubmitButton>
                    </form.AppForm>
                </div>
            </form>
        </Modal>
    )
}

export default ModalManageBanner
