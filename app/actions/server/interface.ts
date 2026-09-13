import { Prisma } from '@/app/generated/prisma/client'

export type IServer = Prisma.ServerGetPayload<{
    select: {
        id: true
        name: true
        subtitle: true
        imageUrl: true
    }
}>