'use server'

import { Item } from '@/app/generated/prisma/client'
import { IActionResponse } from '../interface'
import { prisma } from '@/lib/prisma'
import { ItemFormValues } from '@/app/shop/components/modals/schema'
import { IItem, IItemFilter } from './interface'
import { getSession } from '../session'

export async function createItem(values: ItemFormValues, serverId: number): Promise<IActionResponse<Item>> {
    const session = await getSession()
    if (!session?.isAdmin) {
        return { success: false, error: "ไม่มีสิทธิ์เข้าถึง" }
    }
    try {
        const { price, amount, imageUrl, ...rest } = values
        const res = await prisma.item.create({
            data: {
                serverId,
                price: Number(price),
                amount: Number(amount),
                imageUrl: imageUrl || null,
                isAvailable: true,
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

export async function updateItem(item: IItem, values: ItemFormValues): Promise<IActionResponse<undefined>> {
    const session = await getSession()
    if (!session?.isAdmin) {
        return { success: false, error: "ไม่มีสิทธิ์เข้าถึง" }
    }
    try {
        const { price, amount, imageUrl, ...rest } = values
        await prisma.item.update({
            where: { id: item.id },
            data: {
                price: Number(price),
                amount: Number(amount),
                imageUrl: imageUrl || null,
                ...rest
            },
        })
        return { success: true }
    } catch (e) {
        console.log(e)
        return {
            success: false,
            error: "ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}

export async function deleteItem(id: number): Promise<IActionResponse<undefined>> {
    const session = await getSession()
    if (!session?.isAdmin) {
        return { success: false, error: "ไม่มีสิทธิ์เข้าถึง" }
    }
    try {
        await prisma.item.update({
            where: { id },
            data: {
                isAvailable: false
            }
        })
        return { success: true }
    } catch (e) {
        console.log(e)
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
                isAvailable: true,
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
                command: true,
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
