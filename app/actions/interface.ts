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

interface SuccessResponse<T> {
    success: true;
    data: T;
}

interface ErrorResponse {
    success: false;
    error: {
        message: string;
        code?: string;
    };
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse