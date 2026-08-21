import type { ReactNode } from 'react'

export interface IFieldWrapperProps {
  label?: string
  htmlFor?: string
  required?: boolean
  hideLabel?: boolean
  tooltip?: ReactNode
  layout?: 'horizontal' | 'vertical'
  className?: string
  children: ReactNode
}