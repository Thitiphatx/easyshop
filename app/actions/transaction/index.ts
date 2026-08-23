"use server"

import { prisma } from "@/lib/prisma";
import { IActionResponse } from "../interface";
import { ITransaction, ITransactionFilter } from "./interface";

export async function getTransactions(request: ITransactionFilter): Promise<IActionResponse<ITransaction[]>> {
    try {
        const { page = 1, size = 10, playerName } = request

        const result = await prisma.transaction.findMany({
            skip: (page - 1) * size,
            take: size,
            select: {
                id: true,
                username: true,
                itemId: true,
                serverId: true,
                pricePaid: true,
                createdAt: true,
                item: {
                    select: {
                        name: true,
                        imageUrl: true,
                    }
                },
                server: {
                    select: {
                        name: true,
                    }
                }
            },
            ...(playerName && {
                where: {
                    username: {
                        equals: playerName,
                    }
                }
            })
        })

        const data: ITransaction[] = result.map((item) => ({
            ...item,
            item: {
                name: item.item?.name || '',
            },
            server: {
                name: item.server?.name || '',
            },
        }))

        return {
            success: true,
            data,
        }
    } catch {
        return {
            success: false,
            error: "ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}