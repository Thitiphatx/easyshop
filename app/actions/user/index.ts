'use server'

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { IActionResponse, IPagination, ISummaryData } from "../interface";
import { IUser, IUserFilter } from "./interface";
import { getDateRange, SummaryType } from "@/app/utils/utils";
import { getSession } from "../session";

export async function getUsers(request: IUserFilter): Promise<IActionResponse<IPagination<IUser>>> {
    const { page = 1, size = 10, search, isLogged, isAdmin, sort, order } = request;

    try {
        const where: Prisma.AuthMeWhereInput = {};

        if (search && search.trim()) {
            const term = search.trim();
            const numericId = Number(term);
            where.OR = [
                ...(!isNaN(numericId) && Number.isInteger(numericId) ? [{ id: numericId }] : []),
                { username: { contains: term } },
                { email: { contains: term } },
                { ip: { contains: term } },
            ];
        }

        const toBit = (val: unknown): number | undefined => {
            if (val === true || val === 'true') return 1;
            if (val === false || val === 'false') return 0;
            return undefined;
        };

        const isLoggedBit = toBit(isLogged);
        if (isLoggedBit !== undefined) {
            where.isLogged = isLoggedBit;
        }

        const isAdminBit = toBit(isAdmin);
        if (isAdminBit !== undefined) {
            where.isAdmin = isAdminBit;
        }

        const orderDirection: Prisma.SortOrder = order === 'asc' ? 'asc' : 'desc';
        const sortField = sort ? sort : undefined;

        const orderBy: Prisma.AuthMeOrderByWithRelationInput =
            sortField === 'points'
                ? { points: orderDirection }
                : sortField && ['id', 'username', 'lastlogin', 'email'].includes(sortField)
                    ? { [sortField]: orderDirection }
                    : { id: 'desc' };

        const [result, total] = await Promise.all([
            prisma.authMe.findMany({
                where,
                orderBy,
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
                    points: true
                }
            }),
            prisma.authMe.count({ where })
        ]);

        return {
            success: true,
            data: {
                data: result,
                total: total
            }
        };
    } catch (e) {
        console.log(e)
        return {
            success: false,
            error: "[User] ไม่สามารถดึงข้อมูลผู้เล่นได้"
        };
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
    } catch (e) {
        console.log(e)
        return {
            success: false,
            error: "[User] ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
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
    } catch (e) {
        console.log(e)
        return {
            success: false,
            error: "[User] ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}