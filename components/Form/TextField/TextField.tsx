'use client'

import Input from '@/components/Input/Input'
import { useFieldContext } from '../context'
import { FieldWrapper } from '../FieldWrapper/FieldWrapper'
import type { ITextFieldProps } from './interface'

export function TextField({ label, required, nullable, tooltip, layout, ...inputProps }: ITextFieldProps) {
    const field = useFieldContext<string | null>()
    const isError = field.state.meta.isTouched && field.state.meta.errors.length > 0

    return (
        <FieldWrapper label={label} required={required} tooltip={tooltip} layout={layout}>
            <Input
                {...inputProps}
                value={field.state.value ?? ''}
                onChange={(e) => field.handleChange(
                    nullable ? (e.target.value || null) : e.target.value
                )}
                onBlur={field.handleBlur}
                isError={isError}
                className='w-full'
            />
        </FieldWrapper>
    )
}