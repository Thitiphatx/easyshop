"use server"
import { TopupChannel } from "@/app/generated/prisma/enums";
import { ApiResponse } from "../../interface";
import type { ITopupResult, VerifyBankData } from "../interface";
import { authorizePayment, createTopup, getPointMultiplier } from "../index";
import { getPaymentError } from "../utils/errors";

async function devTopup(devMode: string): Promise<ApiResponse<VerifyBankData>> {

    if (devMode == "fail") {
        return {
            success: false,
            error: {
                code: 'SLIP_NOT_FOUND',
                message: getPaymentError('SLIP_NOT_FOUND')
            }
        }
    }

    const data: VerifyBankData = {
        isDuplicate: devMode == "duplicate",
        rawSlip: {
            payload: "00000000000000000000000000000000000000000000000",
            transRef: "68370160657749I376388B35",
            date: "2024-01-15T14:30:00+07:00",
            countryCode: "TH",
            amount: {
                amount: 1500.00,
                local: {
                    amount: 1500.00,
                    currency: "THB"
                }
            },
            fee: 0,
            sender: {
                bank: {
                    id: "004",
                    name: "กสิกรไทย",
                    short: "KBANK"
                },
                account: {
                    name: {
                        th: "นาย ผู้โอน ทดสอบ",
                        en: "MR. SENDER TEST"
                    },
                    bank: {
                        type: "BANKAC",
                        account: "123-4-xxxxx-5"
                    }
                }
            },
            receiver: {
                bank: {
                    id: "014",
                    name: "ไทยพาณิชย์",
                    short: "SCB"
                },
                account: {
                    name: {
                        th: "นาย รับเงิน ทดสอบ"
                    },
                    bank: {
                        type: "BANKAC",
                        "account": "xxx-x-x5678-x"
                    }
                }
            }
        }
    }
    return {
        success: true,
        data: data
    }
}
export async function topupBank(base64: string, devMode: string, turnstileToken: string): Promise<ApiResponse<ITopupResult>> {
    try {
        const authorization = await authorizePayment(turnstileToken)
        if (!authorization.success) return authorization

        // require easyslip api 
        // const { data } = await easyslip.post<ApiResponse<VerifyBankData>>('/verify/bank', {
        //     base64
        // })

        const res = await devTopup(devMode)

        if (!res.success) {
            return {
                success: false,
                error: res.error
            }
        }
        const data = res.data

        if (data.isDuplicate) {
            return {
                success: false,
                error: {
                    code: 'DUPLICATE_SLIP',
                    message: getPaymentError('DUPLICATE_SLIP')
                }
            }
        }

        const multiplier = await getPointMultiplier()
        if (!multiplier.success) return multiplier

        return createTopup({
            session: authorization.data,
            amount: data.rawSlip.amount.amount,
            pointMultiplier: multiplier.data,
            channel: TopupChannel.BANK,
            reference: data.rawSlip.transRef
        })

    } catch (error: any) {
        // if (error.response) {
        //     const errorCode = error.response.data.error.code as string
        //     const errorMessage = getErrorByCode(errorCode.toUpperCase())
        //     return {
        //         success: false,
        //         error: {
        //             code: error.response.data.error.code,
        //             message: errorMessage.client
        //         }
        //     }
        // }
        console.log(error)
        return {
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: getPaymentError('SERVER_ERROR')
            }
        }
    }
}
