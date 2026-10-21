export interface ISetupWebshop {
    siteName: string
    siteDesc?: string
    logo?: string | null
}

export interface ISetupServer {
    serverName: string
    serverDesc?: string
    serverIp: string
    serverImageUrl?: string | null
}

export interface ISetupTopup {
    enableDirectTruewallet: boolean
    truewalletPhoneNumber: string
    enableTruewallet: boolean
    enableBank: boolean
    easyslipApiKey?: string | null
}

export interface ISetupAdmin {
    adminUsername: string
}

export interface ISetupPayload {
    setupKey: string
    webshop: ISetupWebshop
    server: ISetupServer
    topup: ISetupTopup
    admin: ISetupAdmin
}

export interface IAuthMeUserPreview {
    id: number
    username: string
    realname: string
    uuid: string
    islogged: number
    email?: string | null
}
