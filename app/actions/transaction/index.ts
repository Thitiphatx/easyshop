"use server"

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { IActionResponse, IPagination, ISummaryData } from "../interface";
import { ITransaction, ITransactionFilter } from "./interface";
import { getSession } from "../session";
import { getDateRange, SummaryType } from "@/app/utils/utils";

export async function getTransactions(request: ITransactionFilter): Promise<IActionResponse<IPagination<ITransaction>>> {
    try {
        const { page = 1, size = 10, search, sort, order } = request
        const session = await getSession()

        if (!session) {
            return {
                success: false,
                error: "ไม่พบเซสชัน กรุณาเข้าสู่ระบบ"
            }
        }

        const where: Prisma.TransactionWhereInput = {};

        if (!session.isAdmin) {
            where.username = session.username;
        }

        if (search && search.trim()) {
            const term = search.trim();
            const numericVal = Number(term);
            const isNumeric = !isNaN(numericVal) && Number.isInteger(numericVal);

            where.OR = [
                ...(isNumeric ? [{ id: numericVal }, { pricePaid: numericVal }] : []),
                { username: { contains: term } },
                { item: { name: { contains: term } } },
                { server: { name: { contains: term } } },
            ];
        }

        const orderDirection: Prisma.SortOrder = order === 'asc' ? 'asc' : 'desc';

        let orderBy: Prisma.TransactionOrderByWithRelationInput = { createdAt: orderDirection };

        if (sort === 'id') {
            orderBy = { id: orderDirection };
        } else if (sort === 'username' || sort === 'playerName') {
            orderBy = { username: orderDirection };
        } else if (sort === 'serverName') {
            orderBy = { server: { name: orderDirection } };
        } else if (sort === 'itemName') {
            orderBy = { item: { name: orderDirection } };
        } else if (sort === 'pricePaid') {
            orderBy = { pricePaid: orderDirection };
        } else if (sort === 'createdAt') {
            orderBy = { createdAt: orderDirection };
        }

        const [result, total] = await Promise.all([
            prisma.transaction.findMany({
                where,
                skip: (page - 1) * size,
                take: size,
                orderBy,
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
            prisma.transaction.count({ where }),
        ])

        return {
            success: true,
            data: { data: result, total },
        }
    } catch (e) {
        console.log(e)
        return {
            success: false,
            error: "[Transaction] ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}

export async function getTransactionSummary(type: SummaryType = 'week'): Promise<IActionResponse<ISummaryData>> {
    try {
        const { start, end, labels, buckets, getBucket } = getDateRange(type)

        const transactions = await prisma.transaction.findMany({
            where: {
                createdAt: { gte: start, lte: end },
            },
            select: {
                pricePaid: true,
                createdAt: true,
            },
        })

        const sums = Array(buckets).fill(0)

        for (const transaction of transactions) {
            const idx = getBucket(transaction.createdAt)
            sums[idx] += Number(transaction.pricePaid)
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
            error: "[Transaction] ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}