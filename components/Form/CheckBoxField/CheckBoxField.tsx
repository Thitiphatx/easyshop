'use client'

import { useId } from 'react'
import { useFieldContext } from '../context'
import { FieldWrapper } from '../FieldWrapper/FieldWrapper'
import Checkbox from '@/components/Checkbox/Checkbox'
import { ICheckboxFieldProps } from './interface'

export function CheckboxField({ label, className, labelClassName }: ICheckboxFieldProps) {
    const field = useFieldContext<boolean>()
    const id = useId()

    return (
        <FieldWrapper htmlFor={id} layout="horizontal" className={className}>
            <Checkbox
                id={id}
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                onBlur={field.handleBlur}
            />
            <span className={`ml-2 text-shadow ${labelClassName ?? ''}`}>
                {label}
            </span>
        </FieldWrapper>
    )
}