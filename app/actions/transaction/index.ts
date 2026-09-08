"use server"

import { prisma } from "@/lib/prisma";
import { IActionResponse, IPagination, ISummaryData } from "../interface";
import { ITransaction, ITransactionFilter } from "./interface";
import { getSession } from "../session";
import { getLastWeekRange } from "@/app/utils/utils";

export async function getTransactions(request: ITransactionFilter): Promise<IActionResponse<IPagination<ITransaction>>> {
    try {
        const { page = 1, size = 10 } = request
        const session = await getSession()

        if (!session) {
            return {
                success: false,
                error: "ไม่พบเซสชัน กรุณาเข้าสู่ระบบ"
            }
        }

        let playerName = request.playerName
        if (!session.isAdmin) {
            playerName = session.username
        }


        const whereClause = playerName ? { username: { equals: playerName } } : undefined

        const [result, total] = await Promise.all([
            prisma.transaction.findMany({
                where: whereClause,
                skip: (page - 1) * size,
                take: size,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    username: true,
                    itemId: true,
                    serverId: true,
                    pricePaid: true,
                    createdAt: true,
                    item: { select: { name: true, imageUrl: true } },
                    server: { select: { name: true } },
                },
            }),
            prisma.transaction.count({ where: whereClause }),
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

export async function getTransactionSummary(): Promise<IActionResponse<ISummaryData>> {
    try {
        const { startOfWeek, endOfWeek } = getLastWeekRange()

        const transactions = await prisma.transaction.findMany({
            where: {
                createdAt: { gte: startOfWeek, lte: endOfWeek },
            },
            select: {
                pricePaid: true,
                createdAt: true,
            },
        })

        const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const sums = Array(7).fill(0)

        for (const transaction of transactions) {
            const jsDay = transaction.createdAt.getDay()
            const idx = jsDay === 0 ? 6 : jsDay - 1
            sums[idx] += Number(transaction.pricePaid)
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