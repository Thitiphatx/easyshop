'use server'

import { Server } from '@/app/generated/prisma/client'
import { IActionResponse } from '../interface'
import { prisma } from '@/lib/prisma'

export async function createServer(values: Omit<Server, 'id'>) {
    await prisma.server.create({
        data: values,
    })
}

export async function updateServer(values: Server) {
    await prisma.server.update({
        where: { id: values.id },
        data: values,
    })
}

export async function deleteServer(id: number): Promise<IActionResponse<undefined>> {
    try {
        const res = await prisma.server.delete({
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
