'use client'

import { useFieldContext } from '../context'
import { FieldWrapper } from '../FieldWrapper/FieldWrapper'
import type { ISelectFieldProps } from './interface'

export function SelectField({ label, options, required, placeholder, className, ...selectProps }: ISelectFieldProps) {
    const field = useFieldContext<string>()

    return (
        <FieldWrapper label={label} required={required}>
            <select
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={`field-select ${className ?? ''}`}
                {...selectProps}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </FieldWrapper>
    )
}