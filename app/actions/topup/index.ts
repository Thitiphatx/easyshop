"use server"

import { prisma } from "@/lib/prisma";
import { IActionResponse, IPagination } from "../interface";
import { ITopup, ITopupFilter } from "./interface";
import { getSession } from "../session";

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
