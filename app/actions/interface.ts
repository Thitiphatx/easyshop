export interface IActionResponse<T> {
    success: boolean
    error?: string
    data?: T
}