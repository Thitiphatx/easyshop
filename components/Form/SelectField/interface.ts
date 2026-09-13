import type { SelectHTMLAttributes } from 'react'

export interface ISelectOption {
  label: string
  value: string | number
}

export interface ISelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange' | 'onBlur'> {
  label: string
  options: ISelectOption[]
  required?: boolean
  placeholder?: string
  layout?: 'horizontal' | 'vertical'
}