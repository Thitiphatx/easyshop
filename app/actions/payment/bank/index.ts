"use server"
import { ApiResponse } from "../../interface";
import { easyslip } from "../easyslip";
import type { VerifyBankData } from "../interface";
import { IBank, IListBankAccountsRequest, ListBankAccountsResponse } from "../types/bank-accounts";
import { getBankNameByCode } from "../utils/bank-codes";
import { getErrorByCode } from "../utils/errors";

export async function verifyBank(base64: string): Promise<ApiResponse<VerifyBankData>> {
    try {
        const { data } = await easyslip.post('/verify/bank', {
            base64
        })
        return data
    } catch (error: any) {
        if (error.response) {
            const errorCode = error.response.data.error.code as string
            const errorMessage = getErrorByCode(errorCode.toUpperCase())
            return {
                success: false,
                error: {
                    code: error.response.data.error.code,
                    message: errorMessage.client
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

export async function getBankInfo(request?: IListBankAccountsRequest): Promise<ApiResponse<IBank>> {
    try {
        const { data } = await easyslip.get<ApiResponse<ListBankAccountsResponse>>('/bank-accounts', {
            params: request,
        })
        if (data.success) {
            const first = data.data.items.find(item => item.bankCode !== 'TRUEMONEYWALLET') ?? null
            if (!first) {
                return {
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'ไม่พบข้อมูลธนาคาร'
                    }
                }
            }
            return {
                success: true,
                data: {
                    ...first,
                    bankNameTh: getBankNameByCode(first.bankCode).nameTh,
                }
            }
        }
        return {
            success: false,
            error: data.error
        }
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
