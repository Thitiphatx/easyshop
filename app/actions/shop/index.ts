"use server"

import { IBuyItemRequest } from "./interface";
import { IActionResponse } from "../interface";
import { prisma } from "@/lib/prisma";
import { sendItem } from "@/app/actions/rcon";

export async function buyItem(request: IBuyItemRequest): Promise<IActionResponse<void>> {
    const product = await prisma.item.findFirst({
        where: { id: request.itemId }
    })

    if (!product) {
        return { success: false, error: "ไม่พบสินค้าในระบบ" }
    }

    const user = await prisma.authMe.findFirst({
        where: { username: request.playerName },
        include: { points: true }
    })

    if (!user) {
        return { success: false, error: "ไม่พบผู้ใช้ในระบบ" }
    }

    const userPoints = user.points?.points ?? 0;
    if (userPoints < product.price) {
        return { success: false, error: "พอยท์ไม่เพียงพอ" }
    }

    // Deduct points first inside a transaction, then attempt RCON.
    // If RCON fails, roll back the point deduction.
    let pointsDeducted = false;

    try {
        await prisma.$transaction(async (tx) => {
            await tx.authMe.update({
                where: { id: user.id },
                data: {
                    points: {
                        update: { points: userPoints - product.price }
                    }
                }
            })

            pointsDeducted = true;

            // Send item via RCON — if this throws, the transaction rolls back
            const rconRes = await sendItem({
                itemId: product.id,
                playerName: request.playerName
            })

            if (!rconRes.success) {
                throw new Error(rconRes.error ?? "ส่งไอเทมไม่สำเร็จ")
            }
        })

        return { success: true }
    } catch (err) {
        return {
            success: false,
            error: (err as Error).message
        }
    }
}