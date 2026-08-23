import type { ImageGroup } from '@/app/actions/image/interface'

export interface IImageSelectFieldProps {
    label: string
    required?: boolean
    group: ImageGroup
}
