'use server'

import { Server } from '@/app/generated/prisma/client'
import { IActionResponse } from '../interface'
import { prisma } from '@/lib/prisma'
import { ServerFormValues } from '@/app/shop/components/modals/schema'

export async function createServer(values: ServerFormValues): Promise<IActionResponse<Server>> {
    try {
        const { imageUrl, ...rest } = values
        const serverRes = await prisma.server.create({
            data: {
                ...rest,
                imageUrl,
            },
        })
        return {
            success: true,
            data: serverRes
        }
    } catch {
        return {
            success: false,
            error: "ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}

export async function updateServer(values: Server) {
    await prisma.server.update({
        where: { id: values.id },
        data: values,
    })
}

export async function deleteServer(id: number): Promise<IActionResponse<undefined>> {
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

export async function getAllServers(): Promise<IActionResponse<Server[]>> {
    try {
        const res = await prisma.server.findMany()
        console.log(res)
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
