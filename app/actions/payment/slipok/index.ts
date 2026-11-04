"use server"

import { TopupChannel, TopupStatus } from "@/app/generated/prisma/enums"
import { decrypt } from "@/lib/crypto"
import { prisma } from "@/lib/prisma"
import { slipok } from "@/lib/slipok"
import { verifyTurnstile } from "@/lib/turnstile"
import axios from "axios"
import { ApiResponse } from "../../interface"
import { getSession } from "../../session"
import { ITopupResult } from "../interface"
import { getPaymentError } from "../utils/errors"
import { ISlipOkBankInfo, ISlipOkQuota, ISlipOkSlip } from "./interface"

export async function getBankInfo(): Promise<ApiResponse<ISlipOkBankInfo>> {
    try {
        const setting = await prisma.setting.findFirst({
            select: {
                bank: true,
                bankName: true,
                bankNumber: true
            }
        })

        if (!setting?.bank || !setting.bankName || !setting.bankNumber) {
            return {
                success: false,
                error: {
                    code: 'BANK_INFO_NOT_FOUND',
                    message: getPaymentError('BANK_INFO_NOT_FOUND')
                }
            }
        }

        return {
            success: true,
            data: {
                bank: setting.bank,
                bankName: setting.bankName,
                bankNumber: setting.bankNumber
            }
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: getPaymentError('SERVER_ERROR')
            }
        }
    }
}

export async function getQuota(): Promise<ApiResponse<ISlipOkQuota>> {
    try {
        const slipOkSetting = await prisma.setting.findFirst({
            select: {
                slipOkApiKey: true,
                slipOkBranchId: true,
                enableBank: true
            }
        })
        if (!slipOkSetting) {
            return {
                success: false,
                error: {
                    code: 'DISABLED_PROMPTPAY',
                    message: "ระบบไม่ได้เปิดการชำระเงินธนาคาร"
                }
            }
        }

        const { slipOkApiKey, slipOkBranchId, enableBank } = slipOkSetting
        if (!slipOkApiKey || !slipOkBranchId || !enableBank) {
            return {
                success: false,
                error: {
                    code: 'DISABLED_PROMPTPAY',
                    message: "ระบบไม่ได้เปิดการชำระเงินธนาคาร"
                }
            }
        }

        const branchId = decrypt(slipOkBranchId)
        const { data } = await slipok.get<ISlipOkQuota>(`${branchId}/quota`)
        return {
            success: true,
            data: data
        }

    } catch (error) {
        console.error(error)
        return {
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: '[SlipOk] ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้'
            }
        }
    }
}

export async function verifySlip(base64: string, turnstileToken: string): Promise<ApiResponse<ITopupResult>> {
    try {
        const turnstile = await verifyTurnstile(turnstileToken)
        if (!turnstile) {
            return {
                success: false,
                error: {
                    code: 'CF_UNKNOWN_ERROR',
                    message: getPaymentError('CF_UNKNOWN_ERROR')
                }
            }
        }

        const session = await getSession()
        if (!session || !session.username) {
            return {
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: getPaymentError('UNAUTHORIZED')
                }
            }
        }

        const setting = await prisma.setting.findFirst({
            select: {
                slipOkApiKey: true,
                slipOkBranchId: true,
                enableBank: true,
                pointMultiplier: true
            }
        })
        if (!setting) {
            return {
                success: false,
                error: {
                    code: 'DISABLED_PROMPTPAY',
                    message: "ระบบไม่ได้เปิดการชำระเงินพร้อมเพย์"
                }
            }
        }

        const { slipOkApiKey, slipOkBranchId, enableBank } = setting
        if (!slipOkApiKey || !slipOkBranchId || !enableBank) {
            return {
                success: false,
                error: {
                    code: 'DISABLED_PROMPTPAY',
                    message: "ระบบไม่ได้เปิดการชำระเงินพร้อมเพย์"
                }
            }
        }

        const branchId = decrypt(slipOkBranchId)
        const { data } = await slipok.post<ApiResponse<ISlipOkSlip>>(`${branchId}`, {
            files: base64,
            log: true
        })

        if (!data.success) {
            const code = data.error.code ?? 'SERVER_ERROR'
            return {
                success: false,
                error: {
                    code,
                    message: getPaymentError(code, data.error.message)
                }
            }
        }


        const receivePoint = Number(data.data.amount * setting.pointMultiplier) || 0
        const account = await prisma.$transaction(async (tx) => {
            const updatedAccount = await tx.authMe.update({
                where: { username: session.username },
                data: {
                    points: {
                        increment: receivePoint
                    }
                },
                select: {
                    points: true
                }
            })

            await prisma.topup.create({
                data: {
                    userId: session.id,
                    amount: data.data.amount,
                    channel: TopupChannel.BANK,
                    status: TopupStatus.SUCCESS,
                    pointsAdded: receivePoint,
                    reference: data.data.transRef
                }
            })

            return updatedAccount
        })

        return {
            success: true,
            data: {
                receivePoint: receivePoint,
                totalPoint: account.points
            }
        }

    } catch (error) {
        const responseBody = axios.isAxiosError(error) ? error.response?.data : undefined
        const responseError = responseBody?.error ?? responseBody
        const code = responseError?.code == null ? 'SERVER_ERROR' : String(responseError.code)
        const responseMessage = typeof responseError?.message === 'string' ? responseError.message : undefined

        console.error('[SlipOK] ตรวจสอบสลิปผิดพลาด', {
            status: axios.isAxiosError(error) ? error.response?.status : undefined,
            code,
            message: responseMessage ?? (error instanceof Error ? error.message : String(error))
        })

        return {
            success: false,
            error: {
                code,
                message: getPaymentError(code, responseMessage)
            }
        }
    }
}
