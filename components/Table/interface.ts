import { IPaginationProps } from '../Pagination/interface'

export interface ITableColumn<T> {
    key: keyof T | string
    label: string
    render?: (value: any, row: T, index: number) => React.ReactNode
    align?: 'left' | 'center' | 'right'
}

export interface ITableProps<T> {
    columns: ITableColumn<T>[]
    data: T[]
    loading?: boolean
    emptyText?: string
    className?: string
    pagination?: Omit<IPaginationProps, 'size'> & { size: number }
}
