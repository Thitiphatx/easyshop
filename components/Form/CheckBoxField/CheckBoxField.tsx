'use client'

import { useFieldContext } from '../context'
import { FieldWrapper } from '../FieldWrapper/FieldWrapper'
import type { ICheckboxFieldProps } from './interface'

export function CheckboxField({ label }: ICheckboxFieldProps) {
  const field = useFieldContext<boolean>()

  return (
    <FieldWrapper label={label}>
      <input
        type="checkbox"
        checked={field.state.value}
        onChange={(e) => field.handleChange(e.target.checked)}
        onBlur={field.handleBlur}
      />
    </FieldWrapper>
  )
}