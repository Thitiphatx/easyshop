"use client"
import Button from '@/components/Button/Button'
import Input from '@/components/Form/Input'
import { formOptions, useForm } from '@tanstack/react-form'
import React from 'react'
import { z } from 'zod'

const userSchema = z.object({
    username: z.string().min(3, 'Username ต้องมีอย่างน้อย 3 ตัวอักษร'),
    email: z.string().email('รูปแบบ Email ไม่ถูกต้อง'),
    age: z.number({ error: 'กรุณากรอกตัวเลข' }).min(18, 'ต้องมีอายุ 18 ปีขึ้นไป'),
})

type UserFormData = z.infer<typeof userSchema>

const TrueWalletPage: React.FC = () => {
    const form = useForm({
        defaultValues: {
            username: '',
            email: '',
            age: 0,
        } as UserFormData,
        validators: {
            // Validate ข้อมูลทั้ง form ก่อน Submit
            onSubmit: userSchema,
        },
        onSubmit: async ({ value }) => {
            console.log('Form Values:', value)
            alert(JSON.stringify(value, null, 2))
        },
    })

    return (
        <div className='flex-1 w-full bg-[url(https://images2.alphacoders.com/137/thumb-1920-1370592.jpeg)] bg-cover bg-center flex justify-center items-center'>
            <div className='max-w-2xl w-full mx-auto z-10'>
                <span className='text-center text-(--mc-core-white) drop-shadow-lg'>
                    <h1 className='font-pixel text-8xl'>TrueWallet</h1>
                    <h2 className='text-5xl '>กรอกลิงก์ซองของขวัญ</h2>
                </span>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="space-y-4"
                >
                    {/* Username Field */}
                    <form.Field
                        name="username"
                        validators={{
                            onChange: userSchema.shape.username,
                        }}
                    >
                        {(field) => (
                            <div className="flex flex-col gap-1">
                                <label htmlFor={field.name} className="text-sm font-bold text-(--mc-core-white)">
                                    Username
                                </label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="john_doe"
                                />
                                {field.state.meta.errors.length > 0 ? (
                                    <p className="bg-(--mc-default-warning) p-2 text-(--mc-core-white) text-sm">
                                        {field.state.meta.errors.map((err) => err?.message).join(', ')}
                                    </p>
                                ) : null}
                            </div>
                        )}
                    </form.Field>

                    {/* Submit Button */}
                    <div className='flex justify-center'>
                        <form.Subscribe
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                        >
                            {([canSubmit, isSubmitting]) => (
                                <Button
                                    type="submit"
                                    variant='Solid'
                                    color='Green'
                                    disabled={!canSubmit || isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'ยืนยัน'}
                                </Button>
                            )}
                        </form.Subscribe>
                    </div>
                </form>
            </div>
            <div className='fixed top-0 left-0 w-full h-full bg-(--mc-core-off-black)/30 z-0'>
            </div>
        </div>
    )
}

export default TrueWalletPage