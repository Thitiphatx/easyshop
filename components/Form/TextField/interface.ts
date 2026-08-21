import { IInputProps } from '@/components/Input/interface'
import type { InputHTMLAttributes, ReactNode } from 'react'

export interface ITextFieldProps
    extends Omit<IInputProps, 'value' | 'onChange' | 'onBlur'> {
    label: string
    required?: boolean
    tooltip?: ReactNode
}