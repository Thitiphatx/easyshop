"use server"
import { EASYSLIP_ERROR } from "@/app/utils/formatter";
import { ApiResponse } from "../../interface";
import { easyslip } from "../easyslip";
import type { VerifyBankData } from "../interface";
import { BankAccount, IListBankAccountsRequest, ListBankAccountsResponse } from "../types/bank-accounts";

export async function verifyBank(base64: string): Promise<ApiResponse<VerifyBankData>> {
    try {
        const { data } = await easyslip.post('/verify/bank', {
            base64
        })
        return data
    } catch (error: any) {
        if (error.response) {
            return {
                success: false,
                error: {
                    code: error.response.data.error.code,
                    message: EASYSLIP_ERROR[(error.response.data.error.code as string).toUpperCase()]?.client || error.response.data.error.message
                }
            }
        }
        return {
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้'
            }
        }
    }
}

export async function getBankAccounts(request?: IListBankAccountsRequest): Promise<ApiResponse<ListBankAccountsResponse>> {
    try {
        const { data } = await easyslip.get<ApiResponse<ListBankAccountsResponse>>('/bank-accounts', {
            params: request,
        })
        return data
    } catch (error) {
        return {
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้'
            }
        }
    }
}

export async function getFirstBank(): Promise<BankAccount | null> {
    const res = await getBankAccounts()
    if (res.success) {
        const first = res.data.items.find(item => item.bankCode !== 'TRUEMONEYWALLET') ?? null
        return first
    }
    return null
}
