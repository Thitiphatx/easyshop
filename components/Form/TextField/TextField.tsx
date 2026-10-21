'use client'

import Input from '@/components/Input/Input'
import { useFieldContext } from '../context'
import { FieldWrapper } from '../FieldWrapper/FieldWrapper'
import type { ITextFieldProps } from './interface'
import { useState } from 'react'
import { Eye } from 'pixelarticons/react/Eye'
import { EyeOff } from 'pixelarticons/react/EyeOff'

export function TextField({ label, required, nullable, tooltip, layout, type, ...inputProps }: ITextFieldProps) {
    const field = useFieldContext<string | null>()
    const isError = field.state.meta.isTouched && field.state.meta.errors.length > 0
    const [showPassword, setShowPassword] = useState(false)

    const isPassword = type === 'password'
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type

    const isNullable = nullable ?? !required

    return (
        <FieldWrapper label={label} required={required} tooltip={tooltip} layout={layout}>
            <div className='relative w-full'>
                <Input
                    {...inputProps}
                    type={resolvedType}
                    value={field.state.value ?? ''}
                    onChange={(e) => field.handleChange(
                        isNullable ? (e.target.value || null) : e.target.value
                    )}
                    onBlur={field.handleBlur}
                    isError={isError}
                    className={`w-full${isPassword ? ' pr-12' : ''}`}
                />
                {isPassword && (
                    <button
                        type='button'
                        onClick={() => setShowPassword((v) => !v)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-(--core-grey-2) hover:text-(--core-grey-1) cursor-pointer transition-colors'
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <Eye className='w-5 h-5' /> : <EyeOff className='w-5 h-5' />}
                    </button>
                )}
            </div>
        </FieldWrapper>
    )
}