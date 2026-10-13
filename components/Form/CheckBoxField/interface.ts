import type { ReactNode } from 'react'

export interface ICheckBoxFieldProps {
  label: string
  className?: string
  labelClassName?: string
  variant?: 'normal' | 'switch'
  tooltip?: ReactNode
  disabled?: boolean
}