"use server"

import { prisma } from "@/lib/prisma";
import { Prisma, TopupChannel, TopupStatus } from "@/app/generated/prisma/client";
import { IActionResponse, IPagination, ISummaryData } from "../interface";
import { ITopDonate, ITopDonateFilter, ITopup, ITopupFilter } from "./interface";
import { getSession } from "../session";
import { getDateRange, SummaryType } from "@/app/utils/utils";

export async function getTopups(request: ITopupFilter): Promise<IActionResponse<IPagination<ITopup>>> {
    try {
        const { page = 1, size = 10, search, status, sort, order } = request
        const session = await getSession()

        if (!session) {
            return {
                success: false,
                error: "ไม่พบเซสชัน กรุณาเข้าสู่ระบบ"
            }
        }

        const where: Prisma.TopupWhereInput = {}

        if (!session.isAdmin) {
            where.userId = session.id
        } else if (request.playerName) {
            where.user = { username: { equals: request.playerName } }
        }

        if (status) {
            where.status = status as TopupStatus
        }

        if (search && search.trim()) {
            const term = search.trim()
            const numericVal = Number(term)
            const isNumeric = !isNaN(numericVal) && Number.isInteger(numericVal)

            const matchedChannels = Object.values(TopupChannel).filter((c) =>
                c.toLowerCase().includes(term.toLowerCase())
            ) as TopupChannel[]

            where.OR = [
                ...(isNumeric ? [{ id: numericVal }, { amount: numericVal }, { pointsAdded: numericVal }] : []),
                { user: { username: { contains: term } } },
                ...(matchedChannels.length > 0 ? [{ channel: { in: matchedChannels } }] : []),
                { reference: { contains: term } },
            ]
        }

        const orderDirection: Prisma.SortOrder = order === 'asc' ? 'asc' : 'desc'

        let orderBy: Prisma.TopupOrderByWithRelationInput = { createdAt: orderDirection }

        if (sort === 'id') {
            orderBy = { id: orderDirection }
        } else if (sort === 'username') {
            orderBy = { user: { username: orderDirection } }
        } else if (sort === 'channel') {
            orderBy = { channel: orderDirection }
        } else if (sort === 'amount') {
            orderBy = { amount: orderDirection }
        } else if (sort === 'pointsAdded') {
            orderBy = { pointsAdded: orderDirection }
        } else if (sort === 'status') {
            orderBy = { status: orderDirection }
        } else if (sort === 'createdAt') {
            orderBy = { createdAt: orderDirection }
        }

        const [result, total] = await Promise.all([
            prisma.topup.findMany({
                where,
                skip: (page - 1) * size,
                take: size,
                orderBy,
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
            prisma.topup.count({ where }),
        ])

        return {
            success: true,
            data: { data: result, total },
        }
    } catch (e) {
        console.log(e)
        return {
            success: false,
            error: "[Topup] ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}

export async function getTopupSummary(type: SummaryType = 'week'): Promise<IActionResponse<ISummaryData>> {
    try {
        const { start, end, labels, buckets, getBucket } = getDateRange(type)

        const topups = await prisma.topup.findMany({
            where: {
                createdAt: { gte: start, lte: end },
            },
            select: {
                amount: true,
                createdAt: true,
            },
        })

        const sums = Array(buckets).fill(0)

        for (const topup of topups) {
            const idx = getBucket(topup.createdAt)
            sums[idx] += Number(topup.amount)
        }

        const total = sums.reduce((a, b) => a + b, 0)

        return {
            success: true,
            data: { data: sums, label: labels, total }
        }
    } catch (e) {
        console.log(e)
        return {
            success: false,
            error: "[Topup] ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}

export async function getTopDonate(request: ITopDonateFilter): Promise<IActionResponse<ITopDonate[]>> {
    try {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        // Group by userId and sum amount
        const grouped = await prisma.topup.groupBy({
            by: ['userId'],
            where: {
                status: 'SUCCESS',
                createdAt: {
                    gte: request.type === 'month' ? startOfMonth : undefined,
                    lte: request.type === 'month' ? endOfMonth : undefined,
                }
            },
            _sum: { amount: true },
            orderBy: { _sum: { amount: 'desc' } },
            take: request.top ?? 10,
        })

        // Fetch usernames for the grouped userIds
        const userIds = grouped.map((g) => g.userId).filter((id): id is number => id !== null)
        const users = await prisma.authMe.findMany({
            where: { id: { in: userIds } },
            select: { id: true, username: true },
        })
        const userMap = new Map(users.map((u) => [u.id, u.username]))

        const data = grouped
            .filter((g) => g.userId !== null && userMap.has(g.userId))
            .map((g, index) => ({
                rank: index + 1,
                username: userMap.get(g.userId!)!,
                amount: g._sum.amount ?? 0,
            }))

        return { success: true, data }
    } catch (e) {
        console.log((e))
        return {
            success: false,
            error: "[Topup] ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}