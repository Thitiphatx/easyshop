'use server'

import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/crypto'
import { IActionResponse } from '../interface'
import { IAuthMeUserPreview, ISetupPayload } from './interface'

export async function checkSettingExists(): Promise<boolean> {
    try {
        const setting = await prisma.setting.findUnique({
            where: { id: 1 },
            select: { id: true },
        })
        return Boolean(setting)
    } catch {
        return false
    }
}

export async function verifySetupKey(key: string): Promise<IActionResponse<boolean>> {
    try {
        const serverKey = (process.env.EASYSHOP_SETUP_KEY || '').trim()
        if (!serverKey) {
            return {
                success: false,
                error: 'ยังไม่ได้ตั้งค่า EASYSHOP_SETUP_KEY ในระบบ (.env)',
            }
        }

        if (key.trim() !== serverKey) {
            return {
                success: false,
                error: 'รหัสผ่าน EASYSHOP_SETUP_KEY ไม่ถูกต้อง',
            }
        }

        return {
            success: true,
            data: true,
        }
    } catch {
        return {
            success: false,
            error: 'เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน',
        }
    }
}

export async function searchAuthMeUser(username: string): Promise<IActionResponse<IAuthMeUserPreview | null>> {
    try {
        if (!username || username.trim().length === 0) {
            return { success: true, data: null }
        }

        const user = await prisma.authMe.findFirst({
            where: {
                username: {
                    equals: username.trim(),
                },
            },
            select: {
                id: true,
                username: true,
                realname: true,
                uuid: true,
                isLogged: true,
                email: true,
            },
        })

        return {
            success: true,
            data: user,
        }
    } catch {
        return {
            success: false,
            error: 'ไม่สามารถค้นหาผู้ใช้งานได้',
        }
    }
}

export async function completeSetup(payload: ISetupPayload): Promise<IActionResponse<void>> {
    try {
        // 1. Verify key directly
        const serverKey = (process.env.EASYSHOP_SETUP_KEY || '').trim()
        if (!serverKey || payload.setupKey.trim() !== serverKey) {
            return {
                success: false,
                error: 'รหัสผ่าน EASYSHOP_SETUP_KEY ไม่ถูกต้อง กรุณากรอกรหัสผ่านใหม่',
            }
        }

        // 2. Verify setting does not exist yet
        const existingSetting = await prisma.setting.findUnique({
            where: { id: 1 },
            select: { id: true },
        })

        if (existingSetting) {
            return {
                success: false,
                error: 'ระบบนี้ได้รับการตั้งค่าแล้ว ไม่สามารถตั้งค่าซ้ำได้',
            }
        }

        // 3. Verify admin user
        const adminUser = await prisma.authMe.findFirst({
            where: {
                username: {
                    equals: payload.admin.adminUsername.trim(),
                },
            },
            select: { id: true, username: true },
        })

        if (!adminUser) {
            return {
                success: false,
                error: `ไม่พบผู้เล่นชื่อ "${payload.admin.adminUsername}" ในระบบ กรุณาเข้าเกมเพื่อสมัครสมาชิกก่อน`,
            }
        }

        // 4. Encrypt EasySlip API key if provided
        const trimmedApiKey = payload.topup.easyslipApiKey?.trim() || ''
        const encryptedApiKey = trimmedApiKey ? encrypt(trimmedApiKey) : null

        const trimmedPhone = payload.topup.truewalletPhoneNumber?.trim() || ''

        // 5. Create setting & update admin user
        await prisma.$transaction([
            prisma.setting.create({
                data: {
                    id: 1,
                    siteName: payload.webshop.siteName.trim(),
                    siteDesc: payload.webshop.siteDesc?.trim() || null,
                    logo: payload.webshop.logo?.trim() || null,
                    serverName: payload.server.serverName.trim(),
                    serverDesc: payload.server.serverDesc?.trim() || null,
                    serverIp: payload.server.serverIp.trim(),
                    serverImageUrl: payload.server.serverImageUrl?.trim() || null,
                    enableTruewallet: trimmedPhone ? payload.topup.enableTruewallet : false,
                    truewalletPhoneNumber: trimmedPhone,
                    enableBank: trimmedApiKey ? payload.topup.enableBank : false,
                    easyslipApiKey: encryptedApiKey,
                    pointMultiplier: 1,
                },
            }),
            prisma.authMe.update({
                where: { id: adminUser.id },
                data: { isAdmin: 1 },
            }),
        ])

        return {
            success: true,
        }
    } catch (err: any) {
        console.log(err)
        return {
            success: false,
            error: err?.message || 'ไม่สามารถบันทึกข้อมูลการตั้งค่าได้',
        }
    }
}
