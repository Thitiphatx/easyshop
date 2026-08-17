import { IInputProps } from '@/components/Input/interface'
import type { InputHTMLAttributes } from 'react'

export interface ITextFieldProps
    extends Omit<IInputProps, 'value' | 'onChange' | 'onBlur'> {
    label: string
    required?: boolean
}