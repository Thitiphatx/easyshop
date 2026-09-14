"use server"

import { prisma } from "@/lib/prisma";
import { IActionResponse, IPagination, ISummaryData } from "../interface";
import { ITopDonate, ITopDonateFilter, ITopup, ITopupFilter } from "./interface";
import { getSession } from "../session";
import { getLastWeekRange } from "@/app/utils/utils";

export async function getTopups(request: ITopupFilter): Promise<IActionResponse<IPagination<ITopup>>> {
    try {
        const { page = 1, size = 10 } = request
        const session = await getSession()

        if (!session) {
            return {
                success: false,
                error: "ไม่พบเซสชัน กรุณาเข้าสู่ระบบ"
            }
        }

        let whereClause: any = undefined
        if (!session.isAdmin) {
            whereClause = { userId: session.id }
        } else if (request.playerName) {
            whereClause = { user: { username: { equals: request.playerName } } }
        }

        const [result, total] = await Promise.all([
            prisma.topup.findMany({
                where: whereClause,
                skip: (page - 1) * size,
                take: size,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    amount: true,
                    pointsAdded: true,
                    channel: true,
                    status: true,
                    reference: true,
                    createdAt: true,
                    user: {
                        select: {
                            username: true,
                        },
                    },
                },
            }),
            prisma.topup.count({ where: whereClause }),
        ])

        return {
            success: true,
            data: { data: result, total },
        }
    } catch {
        return {
            success: false,
            error: "ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}

export async function getTopupSummary(): Promise<IActionResponse<ISummaryData>> {
    try {
        const { startOfWeek, endOfWeek } = getLastWeekRange()

        const topups = await prisma.topup.findMany({
            where: {
                createdAt: { gte: startOfWeek, lte: endOfWeek },
            },
            select: {
                amount: true,
                createdAt: true,
            },
        })

        const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const sums = Array(7).fill(0)

        for (const topup of topups) {
            const jsDay = topup.createdAt.getDay()
            const idx = jsDay === 0 ? 6 : jsDay - 1
            sums[idx] += Number(topup.amount)
        }

        const total = sums.reduce((a, b) => a + b, 0)

        return {
            success: true,
            data: { data: sums, label: dayLabels, total }
        }
    } catch {
        return {
            success: false,
            error: "ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}

export async function getTopDonate(request: ITopDonateFilter): Promise<IActionResponse<ITopDonate[]>> {
    try {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        const res = await prisma.topup.findMany({
            where: {
                status: 'SUCCESS',
                createdAt: {
                    gte: request.type === 'month' ? startOfMonth : undefined,
                    lte: request.type === 'month' ? endOfMonth : undefined,
                }
            },
            select: {
                amount: true,
                user: {
                    select: {
                        username: true,
                    },
                },
            },
            orderBy: {
                amount: 'desc'
            },
            take: request.top ?? 10
        })

        return {
            success: true,
            data: res.map((item) => ({
                username: item.user.username,
                amount: item.amount,
            })),
        }
    } catch {
        return {
            success: false,
            error: "ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }

}