import { IButtonProps } from '@/components/Button/interface'

export interface IResetButtonProps
  extends Omit<IButtonProps, 'type' | 'disabled'> {
  children: React.ReactNode
}