import { Prisma } from "@/app/generated/prisma/client";

export interface IItemFilter {
    serverId?: number
}

export type IItem = Prisma.ItemGetPayload<{
    select: {
        id: true
        name: true
        description: true
        imageUrl: true
        price: true
        amount: true
        category: true
        command: true
        createdAt: true
        lastUpdatedAt: true
    }
}>