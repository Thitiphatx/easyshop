import { IInputProps } from '@/components/Input/interface'
import type { ReactNode } from 'react'

export interface ITextFieldProps
    extends Omit<IInputProps, 'value' | 'onChange' | 'onBlur'> {
    label: string
    required?: boolean
    nullable?: boolean
    tooltip?: ReactNode
    layout?: 'horizontal' | 'vertical'
}