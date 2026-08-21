'use server'

import { Item, Server } from '@/app/generated/prisma/client'
import { IActionResponse } from '../interface'
import { prisma } from '@/lib/prisma'
import { ItemFormValues, ServerFormValues } from '@/app/shop/components/modals/schema'
import { IItem, IItemFilter } from './interface'

export async function createItem(values: ItemFormValues, serverId: number): Promise<IActionResponse<Item>> {
    try {
        const { price, amount, ...rest } = values
        const res = await prisma.item.create({
            data: {
                serverId,
                price: Number(price),
                amount: Number(amount),
                ...rest
            },
        })
        return {
            success: true,
            data: res
        }
    } catch (e) {
        console.log(e)
        return {
            success: false,
            error: "ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}

export async function updateItem(values: Item) {
    try {
        const { price, amount, ...rest } = values
        await prisma.item.update({
            where: { id: values.id },
            data: {
                price: Number(price),
                amount: Number(amount),
                ...rest
            },
        })
        return {
            success: true
        }
    } catch (e) {
        console.log(e)
        return {
            success: false,
            error: "ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}

export async function deleteItem(id: number): Promise<IActionResponse<undefined>> {
    try {
        await prisma.item.delete({
            where: { id },
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

export async function getAllItems(filter: IItemFilter): Promise<IActionResponse<IItem[]>> {
    try {
        const res = await prisma.item.findMany({
            where: {
                ...(filter?.serverId && { serverId: filter.serverId })
            },
            select: {
                id: true,
                name: true,
                description: true,
                imageUrl: true,
                price: true,
                amount: true,
                category: true,
                createdAt: true,
                lastUpdatedAt: true,
            }
        })
        return {
            success: true,
            data: res
        }
    } catch {
        return {
            success: false,
            error: "ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}
