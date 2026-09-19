import { ITextareaProps } from '@/components/Input/interface'
import type { ReactNode } from 'react'

export interface ITextareaFieldProps
    extends Omit<ITextareaProps, 'value' | 'onChange' | 'onBlur'> {
    label: string
    required?: boolean
    nullable?: boolean
    tooltip?: ReactNode
    layout?: 'horizontal' | 'vertical'
}
