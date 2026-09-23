import type { ReactNode } from 'react'

export interface ICheckboxFieldProps {
  label: string
  className?: string
  labelClassName?: string
  variant?: 'normal' | 'switch'
  tooltip?: ReactNode
  disabled?: boolean
}