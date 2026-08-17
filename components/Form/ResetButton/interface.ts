import type { ButtonHTMLAttributes } from 'react'

export interface IResetButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'disabled' | 'onClick'> {
  children: React.ReactNode
}