import { IButtonProps } from '@/components/Button/interface'

export interface ISubmitButtonProps
  extends Omit<IButtonProps, 'type' | 'disabled'> {
  children: React.ReactNode
}