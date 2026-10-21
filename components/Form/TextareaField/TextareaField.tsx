'use client'

import Textarea from '@/components/Input/Textarea'
import { useFieldContext } from '../context'
import { FieldWrapper } from '../FieldWrapper/FieldWrapper'
import type { ITextareaFieldProps } from './interface'

export function TextareaField({ label, required, nullable, tooltip, layout, ...textareaProps }: ITextareaFieldProps) {
    const field = useFieldContext<string | null>()
    const isError = field.state.meta.isTouched && field.state.meta.errors.length > 0

    const isNullable = nullable ?? !required

    return (
        <FieldWrapper label={label} required={required} tooltip={tooltip} layout={layout}>
            <div className='relative w-full'>
                <Textarea
                    {...textareaProps}
                    value={field.state.value ?? ''}
                    onChange={(e) => field.handleChange(
                        isNullable ? (e.target.value || null) : e.target.value
                    )}
                    onBlur={field.handleBlur}
                    isError={isError}
                    className="w-full"
                />
            </div>
        </FieldWrapper>
    )
}
