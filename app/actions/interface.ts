export interface IActionResponse<T> {
    success: boolean
    error?: string
    data?: T
}

export interface IPagination<T> {
    data: T[]
    total: number
}

export interface ISummaryData {
    data: number[]
    label: string[]
    total: number
}