'use server'

import { prisma } from '@/prisma/seed'
import { Server } from '@/app/generated/prisma/client'

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

export async function deleteServer(id: number) {
    await prisma.server.delete({
        where: { id },
    })
}

export async function getAllServers(): Promise<Server[]> {
    return prisma.server.findMany()
}
