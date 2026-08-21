"use client"
import { authenticate } from '@/app/actions/authme'
import { useAuth } from '@/app/contexts/authContext'
import { useAppForm } from '@/components/Form'
import Swal from '@/lib/Swal'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import Modal from '../Modal/Modal'
import { SignInSchema } from './schema'

const AuthModal: React.FC = () => {
    const router = useRouter()
    const { isOpen, setIsOpen, setSession, closeAuth } = useAuth()

    const form = useAppForm({
        defaultValues: { username: '', password: '' },
        validators: {
            onSubmit: SignInSchema
        },
        onSubmit: async ({ value }) => {
            const res = await authenticate(value)
            if (res.success && res.data) {
                setSession(res.data)
                closeAuth()
                await Swal.fire({
                    icon: 'success',
                    title: "เข้าสู่ระบบสำเร็จ",
                })
                router.refresh()
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: res.error,
                })
            }
        },
    })

    useEffect(() => {
        if (isOpen) {
            form.reset()
        }
    }, [isOpen])

    return (
        <Modal
            modalTitle="Sign-In"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <form className="mt-6" onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                <form.AppField
                    name="username"
                    children={(field) => <field.TextField label="Username" placeholder='กรอกชื่อในเกม' required />}
                />
                <form.AppField
                    name="password"
                    children={(field) => <field.TextField label="Password" placeholder='กรอกรหัสผ่านในเซิฟ' type="password" required />}
                />
                <div className="flex justify-center">
                    <form.AppForm>
                        <form.SubmitButton block>เข้าสู่ระบบ</form.SubmitButton>
                    </form.AppForm>
                </div>
            </form>
        </Modal>
    )
}

export default AuthModal


