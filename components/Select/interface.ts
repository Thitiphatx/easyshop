import type { SelectHTMLAttributes } from 'react'

export interface ISelectOption {
    label: string
    value: string | number
}

export interface ISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    options?: ISelectOption[]
    placeholder?: string
    isError?: boolean
}