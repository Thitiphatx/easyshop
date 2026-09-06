'use server'

import { prisma } from '@/lib/prisma'
import { IActionResponse } from '../interface'
import { BannerFormValues } from '@/app/setting/overview/schema'
import { Banner } from '@/app/generated/prisma/client'

export async function getAllBanners(): Promise<IActionResponse<Banner[]>> {
    try {
        const res = await prisma.banner.findMany({ orderBy: { createdAt: 'desc' } })
        return { success: true, data: res }
    } catch {
        return { success: false, error: 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้' }
    }
}

export async function createBanner(values: BannerFormValues): Promise<IActionResponse<Banner>> {
    try {
        const res = await prisma.banner.create({
            data: {
                imageUrl: values.imageUrl,
                link: values.link || null,
            },
        })
        return { success: true, data: res }
    } catch {
        return { success: false, error: 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้' }
    }
}

export async function deleteBanner(id: number): Promise<IActionResponse<undefined>> {
    try {
        await prisma.banner.delete({ where: { id } })
        return { success: true }
    } catch {
        return { success: false, error: 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้' }
    }
}
