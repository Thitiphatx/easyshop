'use client'

import { useFieldContext } from '../context'
import { FieldWrapper } from '../FieldWrapper/FieldWrapper'
import type { ITextFieldProps } from './interface'

export function TextField({ label, required, ...inputProps }: ITextFieldProps) {
    const field = useFieldContext<string>()

    return (
        <FieldWrapper label={label} required={required}>
            <input
                {...inputProps}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="field-input"
            />
        </FieldWrapper>
    )
}