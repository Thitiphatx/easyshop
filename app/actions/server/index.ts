'use server'

import { Server } from '@/app/generated/prisma/client'
import { IActionResponse } from '../interface'
import { prisma } from '@/lib/prisma'
import { ServerFormValues } from '@/app/(main)/shop/components/modals/schema'
import { IServer } from './interface'
import { getSession } from '../session'

export async function createServer(values: ServerFormValues): Promise<IActionResponse<Server>> {
    const session = await getSession()
    if (!session?.isAdmin) {
        return { success: false, error: "ไม่มีสิทธิ์เข้าถึง" }
    }
    try {
        const serverRes = await prisma.server.create({
            data: values,
        })
        return {
            success: true,
            data: serverRes
        }
    } catch (e: any) {
        console.log(e)
        return {
            success: false,
            error: "ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}

export async function updateServer(values: Server): Promise<IActionResponse<Server>> {
    const session = await getSession()
    if (!session?.isAdmin) {
        return { success: false, error: "ไม่มีสิทธิ์เข้าถึง" }
    }

    try {
        const { id, ...data } = values
        const serverRes = await prisma.server.update({
            where: { id },
            data,
        })
        return { success: true, data: serverRes }
    } catch (e) {
        console.log(e)
        return { success: false, error: "ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้" }
    }
}

export async function deleteServer(id: number): Promise<IActionResponse<undefined>> {
    const session = await getSession()
    if (!session?.isAdmin) {
        return { success: false, error: "ไม่มีสิทธิ์เข้าถึง" }
    }
    try {
        await prisma.server.delete({
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

export async function getAllServers(): Promise<IActionResponse<IServer[]>> {
    try {
        const res = await prisma.server.findMany({
            select: {
                id: true,
                name: true,
                subtitle: true,
                imageUrl: true,
            }
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

export async function getServerById(id: number): Promise<IActionResponse<Server>> {
    const session = await getSession()
    if (!session?.isAdmin) {
        return { success: false, error: "ไม่มีสิทธิ์เข้าถึง" }
    }
    try {
        const res = await prisma.server.findUnique({
            where: { id }
        })
        if (!res)
            return {
                success: false,
                error: "ไม่พบเซิร์ฟเวอร์"
            }

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

