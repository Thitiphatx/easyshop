'use server'

import { DisplayFormValues, ServerFormValues } from '@/app/(main)/setting/display/schema'
import { EasyslipFormValues, EasyslipSchema, PromotionFormValues, TrueWalletFormValues } from '@/app/(main)/setting/topup/schema'
import { Prisma, Setting } from '@/app/generated/prisma/client'
import { decrypt, encrypt } from '@/lib/crypto'
import { prisma } from '@/lib/prisma'
import { IActionResponse } from '../interface'
import { IClientSetting } from './interface'
import { getSession } from '../session'

export async function getSetting(): Promise<IActionResponse<Setting | IClientSetting>> {
    try {
        let query: Prisma.SettingFindFirstArgs = {}

        const session = await getSession()
        if (!session?.isAdmin) {
            query = {
                select: {
                    enableBank: true,
                    enableTruewallet: true,
                    siteName: true,
                    siteDesc: true,
                    logo: true,
                    serverIp: true,
                    serverImageUrl: true,
                    serverName: true,
                    serverDesc: true,
                    pointMultiplier: true,
                    truewalletPhoneNumber: true
                }
            }
        }

        const res = await prisma.setting.findFirst(query)
        if (!res) return {
            success: false,
            error: 'ไม่พบข้อมูลการตั้งค่า กรุณา Setup ระบบใหม่อีกครั้ง'
        }
        if (res.easyslipApiKey) {
            res.easyslipApiKey = decrypt(res.easyslipApiKey)
        }
        return { success: true, data: res }
    } catch {
        return { success: false, error: 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้' }
    }
}


export async function updateDisplaySetting(values: DisplayFormValues): Promise<IActionResponse<Setting>> {
    try {
        const { logo, siteDesc, siteName } = values
        const res = await prisma.setting.update({
            where: { id: 1 },
            data: {
                siteName,
                siteDesc,
                logo,
            },
        })
        return { success: true, data: res }
    } catch {
        return { success: false, error: 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้' }
    }
}

export async function updateServerSetting(values: ServerFormValues): Promise<IActionResponse<Setting>> {
    try {
        const { ip: serverIp, serverName, serverDesc, serverImageUrl } = values

        const res = await prisma.setting.update({
            where: { id: 1 },
            data: {
                serverName,
                serverIp,
                serverDesc,
                serverImageUrl,
            },
        })
        return { success: true, data: res }
    } catch {
        return { success: false, error: 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้' }
    }
}

export async function updatePointMultiplier(values: PromotionFormValues): Promise<IActionResponse<Setting>> {
    try {
        const { pointMultiplier } = values

        const res = await prisma.setting.update({
            where: { id: 1 },
            data: {
                pointMultiplier,
            },
        })
        return { success: true, data: res }
    } catch {
        return { success: false, error: 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้' }
    }
}

export async function updateTrueWalletSetting(values: TrueWalletFormValues): Promise<IActionResponse<Setting>> {
    try {
        const { enableTruewallet, truewalletPhoneNumber } = values

        const trimmedPhone = truewalletPhoneNumber ? truewalletPhoneNumber.trim() : ''

        const res = await prisma.setting.update({
            where: { id: 1 },
            data: {
                enableTruewallet: trimmedPhone ? enableTruewallet : false,
                truewalletPhoneNumber: trimmedPhone,
            },
        })
        return { success: true, data: res }
    } catch {
        return { success: false, error: 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้' }
    }
}

export async function updateEasySlipApi(values: EasyslipFormValues): Promise<IActionResponse<Setting>> {
    try {
        const validatedFields = EasyslipSchema.safeParse(values)



        if (!validatedFields.success) {
            return {
                success: false,
                error: validatedFields.error.issues[0]?.message || 'ข้อมูลไม่ถูกต้อง',
            }
        }
        const { enableTruewallet, enableBank, easyslipApiKey } = validatedFields.data

        const trimmedApiKey = easyslipApiKey ? easyslipApiKey.trim() : ''

        const res = await prisma.setting.update({
            where: { id: 1 },
            data: {
                enableTruewallet: trimmedApiKey ? enableTruewallet : false,
                enableBank: trimmedApiKey ? enableBank : false,
                easyslipApiKey: trimmedApiKey ? encrypt(trimmedApiKey) : null,
            },
        })
        if (res.easyslipApiKey) {
            res.easyslipApiKey = decrypt(res.easyslipApiKey)
        }
        return { success: true, data: res }
    } catch {
        return { success: false, error: 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้' }
    }
}