'use server'

import { prisma } from "@/lib/prisma";
import { IActionResponse, IPagination, ISummaryData } from "../interface";
import { IUser, IUserFilter } from "./interface";
import { getDateRange, SummaryType } from "@/app/utils/utils";
import { getSession } from "../session";

export async function getUsers(request: IUserFilter): Promise<IActionResponse<IPagination<IUser>>> {
    const { page = 1, size = 10 } = request;

    const [result, total] = await Promise.all([
        prisma.authMe.findMany({
            skip: (page - 1) * size,
            take: size,
            select: {
                id: true,
                username: true,
                ip: true,
                lastlogin: true,
                email: true,
                isLogged: true,
                isAdmin: true,
                uuid: true,
                playerPoints: {
                    select: {
                        points: true
                    }
                }
            }
        }),
        prisma.authMe.count()
    ])

    return {
        success: true,
        data: {
            data: result,
            total: total
        }
    }
}

export async function getUserSummary(type: SummaryType = 'week'): Promise<IActionResponse<ISummaryData>> {
    try {
        const { start, end, labels, buckets, getBucket } = getDateRange(type)

        const whereClause = {
            regdate: {
                gte: BigInt(start.getTime()),
                lte: BigInt(end.getTime())
            }
        }

        const [users, total] = await Promise.all([
            prisma.authMe.findMany({
                where: whereClause,
                select: {
                    id: true,
                    regdate: true,
                },
            }),
            prisma.authMe.count({ where: whereClause })
        ])

        const sums = Array(buckets).fill(0)

        for (const user of users) {
            const date = new Date(Number(user.regdate))
            const idx = getBucket(date)
            sums[idx] += 1
        }

        return {
            success: true,
            data: { data: sums, label: labels, total }
        }
    } catch {
        return {
            success: false,
            error: "ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}

export async function updateIsAdmin(id: number, isAdmin: boolean): Promise<IActionResponse<void>> {
    const session = await getSession()
    if (session?.id === id) {
        return {
            success: false,
            error: "คุณไม่สามารถเปลี่ยนสิทธิ์ของตัวเองได้"
        }
    }

    try {
        await prisma.authMe.update({
            where: { id },
            data: { isAdmin: isAdmin ? 1 : 0 }
        })
        return {
            success: true
        }
    } catch {
        return {
            success: false,
            error: "ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}