'use client'

import { useFieldContext } from '../context'
import { FieldWrapper } from '../FieldWrapper/FieldWrapper'
import type { ISelectFieldProps } from './interface'

export function SelectField({ label, options, required, placeholder, layout, className, ...selectProps }: ISelectFieldProps) {
    const field = useFieldContext<string | number>()

    return (
        <FieldWrapper label={label} required={required} layout={layout}>
            <select
                value={field.state.value}
                onChange={(e) => {
                    const val = e.target.value
                    field.handleChange(
                        typeof field.state.value === 'number' ? Number(val) : val
                    )
                }}
                onBlur={field.handleBlur}
                className={`p-3 focus:ring-2 ring-(--core-grey-1) border-2 border-(--core-grey-4) bg-(--core-off-black) text-(--core-grey-2) text-lg outline-none w-full ${className ?? ''}`}
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