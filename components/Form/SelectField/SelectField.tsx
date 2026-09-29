'use client'

import Select from '@/components/Select/Select'
import { useFieldContext } from '../context'
import { FieldWrapper } from '../FieldWrapper/FieldWrapper'
import type { ISelectFieldProps } from './interface'

export function SelectField({ label, options, required, placeholder, layout, ...selectProps }: ISelectFieldProps) {
    const field = useFieldContext<string | number>()
    const isError = field.state.meta.isTouched && field.state.meta.errors.length > 0

    return (
        <FieldWrapper label={label} required={required} layout={layout}>
            <Select
                value={field.state.value}
                onChange={(e) => {
                    const val = e.target.value
                    field.handleChange(
                        typeof field.state.value === 'number' ? Number(val) : val
                    )
                }}
                onBlur={field.handleBlur}
                options={options}
                placeholder={placeholder}
                isError={isError}
                {...selectProps}
            />
        </FieldWrapper>
    )
}