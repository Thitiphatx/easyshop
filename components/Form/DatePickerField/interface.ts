import { IDatePickerProps } from '@/components/DatePicker/interface'
import type { ReactNode } from 'react'

export interface IDatePickerFieldProps
    extends Omit<IDatePickerProps, 'value' | 'onChange' | 'onBlur'> {
    label: string
    required?: boolean
    nullable?: boolean
    tooltip?: ReactNode
    layout?: 'horizontal' | 'vertical'
}
