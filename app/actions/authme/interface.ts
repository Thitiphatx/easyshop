import { ISessionPayload } from '../session/interface'

export interface IRequestAuthenticate {
    username: string
    password: string
}

export interface IResponseAuthenticate {
    isSuccess: boolean
    session?: ISessionPayload
    error?: string
    fieldErrors?: Record<string, string[]>
}