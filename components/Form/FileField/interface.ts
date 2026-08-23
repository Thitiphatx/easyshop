import type { IFileInputProps } from '@/components/Input/FileInput'

export interface IFileFieldProps extends Omit<IFileInputProps, 'isError'> {
    label: string
    required?: boolean
}