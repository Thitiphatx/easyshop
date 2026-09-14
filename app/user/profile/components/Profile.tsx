"use client"

import { useAuth } from '@/app/contexts/authContext'
import Card from '@/components/Card/Card'
import { useAppForm } from '@/components/Form'
import React from 'react'
import { ProfileFormValues, ProfileSchema } from '../schema'

const Profile: React.FC = () => {
    const { session } = useAuth()

    const form = useAppForm({
        defaultValues: { email: '' },
        validators: {
            onSubmit: ProfileSchema,
        },
        onSubmit: async ({ value }: { value: ProfileFormValues }) => {

        },
    })

    return (
        <div className='h-full'>
            <img loading="eager" src={`https://mc-heads.net/body/${session?.username}`} alt="Player Avatar" width={64} height={300} />
            <Card cardTitle="ข้อมูลส่วนตัว" >
                <form className='mt-6' onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                    <form.AppField
                        name="email"
                        children={(field) => <field.TextField label="Email" required />}
                    />
                </form>
            </Card>
        </div>
    )
}

export default Profile