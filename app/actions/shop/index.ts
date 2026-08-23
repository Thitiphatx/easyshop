"use server"

import { sendItem } from "@/app/actions/rcon";
import { prisma } from "@/lib/prisma";
import { IActionResponse } from "../interface";
import { IBuyItemRequest } from "./interface";

export async function buyItem(request: IBuyItemRequest): Promise<IActionResponse<void>> {
    const product = await prisma.item.findFirst({
        where: { id: request.itemId }
    })

    if (!product) {
        return { success: false, error: "ไม่พบสินค้าในระบบ" }
    }

    const user = await prisma.authMe.findFirst({
        where: { username: request.playerName },
        include: { playerPoints: true }
    })

    if (!user) {
        return { success: false, error: "ไม่พบผู้ใช้ในระบบ" }
    }

    const userPoints = user.playerPoints?.points ?? 0;
    if (userPoints < product.price) {
        return { success: false, error: "พอยท์ไม่เพียงพอ" }
    }

    try {
        await prisma.$transaction(async (tx) => {
            // deduct player point
            await tx.authMe.update({
                where: { id: user.id },
                data: {
                    playerPoints: {
                        update: { points: userPoints - product.price }
                    }
                }
            })

            // create transaction
            await tx.transaction.create({
                data: {
                    serverId: product.serverId,
                    itemId: product.id,
                    username: request.playerName,
                    pricePaid: product.price,
                    executedCommand: product.command,
                    createdAt: new Date()
                }
            })

            // send command to rcon server
            const rconRes = await sendItem({
                itemId: product.id,
                playerName: request.playerName
            })

            if (!rconRes.success) {
                throw new Error(rconRes.error ?? "ส่งไอเทมไม่สำเร็จ")
            }
        })

        return { success: true }
    } catch {
        return {
            success: false,
            error: "ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}