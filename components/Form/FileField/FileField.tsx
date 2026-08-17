'use client'

import FileInput from '@/components/Input/FileInput'
import { useFieldContext } from '../context'
import { FieldWrapper } from '../FieldWrapper/FieldWrapper'
import type { IFileFieldProps } from './interface'

export function FileField({ label, required, ...inputProps }: IFileFieldProps) {
    const field = useFieldContext<File | null>()
    const isError = field.state.meta.isTouched && field.state.meta.errors.length > 0

    return (
        <FieldWrapper label={label} required={required}>
            <FileInput
                {...inputProps}
                onChange={(file) => field.handleChange(file)}
                onBlur={field.handleBlur}
                isError={isError}
                className='w-full'
            />
        </FieldWrapper>
    )
}