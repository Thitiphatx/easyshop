"use client"
import React from 'react'
import { useAppForm } from '@/components/Form'
import { SignInSchema } from './schema'
import Modal from '../Modal/Modal'
import { authenticate } from '@/app/actions/authme'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { ISessionPayload } from '@/app/actions/session/interface'

interface AuthModalProps {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    setSession: React.Dispatch<React.SetStateAction<ISessionPayload | null>>
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, setIsOpen, setSession }) => {
    const router = useRouter()

    const form = useAppForm({
        defaultValues: { username: '', password: '' },
        validators: {
            onChange: SignInSchema,
            onSubmit: SignInSchema
        },
        onSubmit: async ({ value }) => {
            const result = await authenticate(value)
            if (result.isSuccess) {
                if (result.session) setSession(result.session)
                setIsOpen(false)
                await Swal.fire({
                    icon: 'success',
                    title: 'เข้าสู่ระบบสำเร็จ',
                    text: `ยินดีต้อนรับ ${value.username}`,
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                })
                router.refresh()
            }
        },
    })

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

