import type { ReactNode } from 'react'

export interface IFieldWrapperProps {
  label: string
  required?: boolean
  children: ReactNode
}