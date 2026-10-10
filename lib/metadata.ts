import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export async function generatePageMetadata(pageName: string): Promise<Metadata> {
    try {
        const setting = await prisma.setting.findFirst({
            select: { siteName: true, siteDesc: true },
        })

        const siteName = setting?.siteName ?? 'EasyShop'
        const siteDesc = setting?.siteDesc ?? undefined

        return {
            title: `${siteName} | ${pageName}`,
            description: siteDesc,
        }
    } catch {
        return {
            title: `Easyshop | Database Offline`,
            description: "ไม่สามารถติดต่อฐานข้อมูลได้"
        }
    }

}
