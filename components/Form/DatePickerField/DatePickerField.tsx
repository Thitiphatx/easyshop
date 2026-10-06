'use client'

import DatePicker from '@/components/DatePicker/DatePicker'
import { useFieldContext } from '../context'
import { FieldWrapper } from '../FieldWrapper/FieldWrapper'
import type { IDatePickerFieldProps } from './interface'

export function DatePickerField({ label, required, nullable, tooltip, layout, ...inputProps }: IDatePickerFieldProps) {
    const field = useFieldContext<string | null>()
    const isError = field.state.meta.isTouched && field.state.meta.errors.length > 0

    return (
        <FieldWrapper label={label} required={required} tooltip={tooltip} layout={layout}>
            <DatePicker
                {...inputProps}
                value={field.state.value ?? ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(
                    nullable ? (e.target.value || null) : e.target.value
                )}
                onBlur={field.handleBlur}
                isError={isError}
                className='w-full'
            />
        </FieldWrapper>
    )
}
