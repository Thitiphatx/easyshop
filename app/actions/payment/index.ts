import { TopupStatus } from "@/app/generated/prisma/enums"
import { prisma } from "@/lib/prisma"
import { verifyTurnstile } from "@/lib/turnstile"
import type { ApiResponse } from "../interface"
import { getSession } from "../session"
import type { ISessionPayload } from "../session/interface"
import type { ICreateTopupInput, ITopupResult } from "./interface"
import { getPaymentError } from "./utils/errors"

export async function authorizePayment(turnstileToken: string): Promise<ApiResponse<ISessionPayload>> {
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
    if (!session?.username) {
        return {
            success: false,
            error: {
                code: 'LOGIN_REQUIRED',
                message: getPaymentError('LOGIN_REQUIRED')
            }
        }
    }

    return { success: true, data: session }
}

export async function createTopup(input: ICreateTopupInput): Promise<ApiResponse<ITopupResult>> {
    const receivePoint = Number((input.pointAmount ?? input.amount) * input.pointMultiplier) || 0
    const account = await prisma.$transaction(async (tx) => {
        const updatedAccount = await tx.authMe.update({
            where: { username: input.session.username },
            data: { points: { increment: receivePoint } },
            select: { points: true }
        })

        await tx.topup.create({
            data: {
                userId: input.session.id,
                amount: input.amount,
                channel: input.channel,
                status: TopupStatus.SUCCESS,
                reference: input.reference,
                pointsAdded: receivePoint
            }
        })

        return updatedAccount
    })

    return {
        success: true,
        data: {
            receivePoint,
            totalPoint: account.points
        }
    }
}

export async function getPointMultiplier(): Promise<ApiResponse<number>> {
    const setting = await prisma.setting.findFirst({
        where: { id: 1 },
        select: { pointMultiplier: true }
    })

    if (!setting) {
        return {
            success: false,
            error: {
                code: 'SETTING_NOT_FOUND',
                message: getPaymentError('SETTING_NOT_FOUND')
            }
        }
    }

    return {
        success: true,
        data: setting.pointMultiplier
    }
}
