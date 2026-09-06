'use server'

import { prisma } from '@/lib/prisma'
import { IActionResponse } from '../interface'
import { DisplayFormValues, ServerFormValues } from '@/app/setting/overview/schema'
import { IDisplaySetting, IServerSetting, displaySettingSelect, serverSettingSelect } from './interface'

export async function getDisplaySetting(): Promise<IActionResponse<IDisplaySetting>> {
    try {
        const res = await prisma.setting.findFirst({ select: displaySettingSelect })
        return { success: true, data: res ?? undefined }
    } catch {
        return { success: false, error: 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้' }
    }
}

export async function upsertDisplaySetting(values: DisplayFormValues): Promise<IActionResponse<IDisplaySetting>> {
    try {
        const existing = await prisma.setting.findFirst({ select: { id: true } })
        let res: IDisplaySetting
        if (existing) {
            res = await prisma.setting.update({
                where: { id: existing.id },
                data: {
                    siteName: values.siteName,
                    favicon: values.favicon,
                    logo: values.logo,
                },
                select: displaySettingSelect,
            })
        } else {
            res = await prisma.setting.create({
                data: {
                    siteName: values.siteName,
                    favicon: values.favicon,
                    logo: values.logo,
                    serverIp: '',
                    serverName: '',
                },
                select: displaySettingSelect,
            })
        }
        return { success: true, data: res }
    } catch {
        return { success: false, error: 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้' }
    }
}

export async function getServerSetting(): Promise<IActionResponse<IServerSetting>> {
    try {
        const res = await prisma.setting.findFirst({ select: serverSettingSelect })
        return { success: true, data: res ?? undefined }
    } catch {
        return { success: false, error: 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้' }
    }
}

export async function upsertServerSetting(values: ServerFormValues): Promise<IActionResponse<IServerSetting>> {
    try {
        const existing = await prisma.setting.findFirst({ select: { id: true } })
        let res: IServerSetting
        if (existing) {
            res = await prisma.setting.update({
                where: { id: existing.id },
                data: {
                    serverName: values.serverName,
                    serverIp: values.ip,
                },
                select: serverSettingSelect,
            })
        } else {
            res = await prisma.setting.create({
                data: {
                    serverName: values.serverName,
                    serverIp: values.ip,
                    siteName: '',
                    favicon: '',
                    logo: '',
                },
                select: serverSettingSelect,
            })
        }
        return { success: true, data: res }
    } catch {
        return { success: false, error: 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้' }
    }
}
