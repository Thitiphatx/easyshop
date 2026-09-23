import type { ImageGroup } from '@/app/actions/image/interface'
import type { ReactNode } from 'react'

export interface IImageSelectFieldProps {
    label: string
    required?: boolean
    group: ImageGroup
    layout?: 'horizontal' | 'vertical'
    tooltip?: ReactNode
}
