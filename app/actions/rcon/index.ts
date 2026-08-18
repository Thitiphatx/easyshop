'use server'

import { Rcon, RconOptions } from "rcon-client"
import { IActionResponse } from "../interface"
import { ISendCommandRequest, ISendItemRequest } from "./interface"
import { prisma } from '@/lib/prisma'

async function createConnection(serverId: number): Promise<IActionResponse<Rcon>> {
    try {
        const server = await prisma.server.findUnique({
            where: { id: serverId }
        })

        if (!server) {
            return {
                success: false,
                error: "ไม่พบข้อมูลเซิร์ฟเวอร์ในระบบ"
            }
        }

        const rcon = await Rcon.connect({
            host: server.rconHost,
            port: Number(server.rconPort),
            password: server.rconPassword,
            timeout: 3000
        })

        return {
            success: true,
            data: rcon
        }
    } catch (err) {
        return {
            success: false,
            error: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}

export async function testConnection(serverId: number): Promise<IActionResponse<boolean>> {
    const rconRes = await createConnection(serverId)

    if (!rconRes.success || !rconRes.data) {
        return {
            success: false,
            data: false
        }
    }

    await rconRes.data.end()

    return {
        success: true,
    }
}

export async function sendItem(request: ISendItemRequest): Promise<IActionResponse<undefined>> {
    const product = await prisma.item.findUnique({
        where: { id: request.itemId }
    })

    if (!product) {
        return {
            success: false,
            error: "ไม่พบสินค้าในระบบ"
        }
    }

    const rconRes = await createConnection(request.serverId)
    if (!rconRes.success || !rconRes.data) {
        return {
            success: false,
            error: rconRes.error || "ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }

    const rcon = rconRes.data

    try {
        await rcon.send(product.command.replace("%player%", request.playerName))

        return {
            success: true
        }
    } catch (err) {
        return {
            success: false,
            error: "ส่งคำสั่ง RCON ไม่สำเร็จ: " + (err as Error).message
        }
    } finally {
        await rcon.end()
    }
}

export async function sendCommand(request: ISendCommandRequest): Promise<IActionResponse<undefined>> {
    const rconRes = await createConnection(request.serverId)

    if (!rconRes.success || !rconRes.data) {
        return {
            success: false,
            error: rconRes.error || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
        }
    }

    const rcon = rconRes.data

    try {
        await rcon.send(request.command)

        return {
            success: true
        }
    } catch (err) {
        return {
            success: false,
            error: "ส่งคำสั่ง RCON ไม่สำเร็จ: " + (err as Error).message
        }
    } finally {
        await rcon.end()
    }

}