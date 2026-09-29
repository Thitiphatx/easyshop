import type { ISelectOption, ISelectProps } from '@/components/Select/interface'

export type { ISelectOption }

export interface ISelectFieldProps
  extends Omit<ISelectProps, 'value' | 'onChange' | 'onBlur'> {
  label: string
  options: ISelectOption[]
  required?: boolean
  layout?: 'horizontal' | 'vertical'
}