"use server"

import { prisma } from "@/lib/prisma";
import { IActionResponse, IPagination } from "../interface";
import { ITransaction, ITransactionFilter } from "./interface";
import { getSession } from "../session";

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