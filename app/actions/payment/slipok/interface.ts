export interface ISlipOkQuota {
    quota: number,
    specialQuota: number,
    overQuota: number,
    endDate: string,
    specialEndDate: string | null
}

export interface ISlipOkBankInfo {
    bank: string
    bankName: string
    bankNumber: string
}

export interface ISlipOkSlip {
    success: boolean
    message: string
    language: string
    receivingBank: string
    sendingBank: string
    transRef: string
    transDate: string
    transTime: string
    transTimestamp: string
    sender: {
        displayName: string
        name: string
        proxy: {
            type: string
            value: string
        }
        account: {
            type: 'BANKAC' | 'TOKEN' | 'DUMMY'
            value: string
        }
    }
    receiver: {
        displayName: string
        name: string
        proxy: {
            type: string
            value: string
        }
        account: {
            type: 'BANKAC' | 'TOKEN' | 'DUMMY'
            value: string
        }
    }
    amount: number
    paidLocalAmount?: number
    paidLocalCurrency?: string
    countryCode: string
    transFeeAmount?: string
    ref1?: string
    ref2?: string
    ref3?: string
    toMerchantId?: string
}
