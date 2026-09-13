'use server'

import { Setting } from '@/app/generated/prisma/client'
import { DisplayFormValues, ServerFormValues } from '@/app/setting/display/schema'
import { prisma } from '@/lib/prisma'
import { IActionResponse } from '../interface'
import { MethodFormValues, PromotionFormValues } from '@/app/setting/topup/schema'

export async function getSetting(): Promise<IActionResponse<Setting>> {
    try {
        const res = await prisma.setting.findFirst()
        if (!res) return {
            success: false,
            error: 'ไม่พบข้อมูลการตั้งค่า กรุณา Setup ระบบใหม่อีกครั้ง'
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

export async function updatePaymentMethod(values: MethodFormValues): Promise<IActionResponse<Setting>> {
    try {
        const { enableBank, enableTruewallet } = values
        const res = await prisma.setting.update({
            where: { id: 1 },
            data: {
                enableBank,
                enableTruewallet,
            },
        })
        return { success: true, data: res }
    } catch {
        return { success: false, error: 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้' }
    }
}
