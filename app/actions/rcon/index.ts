'use server'

import { prisma } from '@/lib/prisma'
import { Rcon } from "rcon-client"
import { IActionResponse } from "../interface"
import { ISendCommandRequest, ISendItemRequest } from "./interface"

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
        console.log(err)
        return {
            success: false,
            error: "[Rcon] ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
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

function escapeRegex(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function sendItem(request: ISendItemRequest): Promise<IActionResponse<undefined>> {
    const product = await prisma.item.findUnique({
        where: { id: request.itemId, isAvailable: true },
        include: { server: true }
    })

    if (!product) {
        return {
            success: false,
            error: "สินค้านี้หมดอายุการเปิดขายแล้ว"
        }
    }

    const player = await prisma.authMe.findFirst({
        where: { username: request.playerName },
        select: { isLogged: true }
    })

    if (player && player.isLogged !== 1) {
        return {
            success: false,
            error: "ผู้เล่นยังไม่ได้เข้าสู่ระบบ กรุณาอยู่ในเซิร์ฟเวอร์ก่อนทำรายการ"
        }
    }

    const rconRes = await createConnection(product.serverId)
    if (!rconRes.success || !rconRes.data) {
        return {
            success: false,
            error: rconRes.error || `เซิร์ฟเวอร์ "${product.server?.name || product.serverId}" ออฟไลน์อยู่`
        }
    }

    const rcon = rconRes.data

    try {
        // ตรวจสอบว่าผู้เล่นออนไลน์อยู่ในเซิร์ฟเวอร์นี้จริงๆ ผ่านคำสั่ง list
        const listResponse = await rcon.send("list")
        const cleanListResponse = listResponse.replace(/[§&][0-9a-fk-or]/gi, '')
        const playerPattern = new RegExp(`(^|[^a-zA-Z0-9_])${escapeRegex(request.playerName)}([^a-zA-Z0-9_]|$)`, 'i')

        if (!playerPattern.test(cleanListResponse)) {
            return {
                success: false,
                error: `ผู้เล่น "${request.playerName}" ไม่ได้ออนไลน์อยู่ในเซิร์ฟเวอร์ "${product.server?.name || 'นี้'}" กรุณาเข้าเซิร์ฟเวอร์ก่อนทำรายการ`
            }
        }

        // รองรับคำสั่งหลายบรรทัดหรือคั่นด้วย semicolon (;)
        const rawCommands = product.command
            .split(/\r?\n|;/)
            .map(cmd => cmd.trim())
            .filter(Boolean)

        for (const rawCmd of rawCommands) {
            const command = rawCmd
                .replace(/%player%/gi, request.playerName)

            await rcon.send(command)
        }

        try {
            const broadcast = `${request.playerName} ได้ซื้อ ${product.name} ในราคา ${product.price} พอยท์`
            await rcon.send(`bc ${broadcast}`)
        } catch {
            // ไม่ให้ broadcast ขัดจังหวะการส่งของ
        }

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
            error: rconRes.error || "[Rcon] ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
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