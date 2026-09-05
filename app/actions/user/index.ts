'use server'

import { prisma } from "@/lib/prisma";
import { IActionResponse, IPagination } from "../interface";
import { IUser, IUserFilter } from "./interface";

export async function getUsers(request: IUserFilter): Promise<IActionResponse<IPagination<IUser>>> {
    const { page = 1, size = 10 } = request;

    const [result, total] = await Promise.all([
        prisma.authMe.findMany({
            skip: (page - 1) * size,
            take: size,
            select: {
                id: true,
                username: true,
                ip: true,
                lastlogin: true,
                email: true,
                isLogged: true,
                uuid: true,
                playerPoints: {
                    select: {
                        points: true
                    }
                }
            }
        }),
        prisma.authMe.count()
    ])

    return {
        success: true,
        data: {
            data: result,
            total: total
        }
    }
}