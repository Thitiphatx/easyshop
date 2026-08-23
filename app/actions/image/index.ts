'use server'

import fs from 'fs'
import path from 'path'
import { IActionResponse } from '../interface'
import { ImageGroup } from './interface'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
}

export async function uploadImage(
    file: File,
    group: ImageGroup
): Promise<IActionResponse<string>> {
    if (!(file instanceof File)) {
        return { success: false, error: 'ไม่พบไฟล์' }
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
        return { success: false, error: 'รองรับเฉพาะไฟล์ JPEG, PNG, WebP, GIF' }
    }

    if (file.size > MAX_SIZE_BYTES) {
        return { success: false, error: 'ไฟล์ต้องมีขนาดไม่เกิน 5 MB' }
    }

    const ext = file.name.split('.').pop() ?? 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const uploadDir = path.join(process.cwd(), 'public', 'images', group)
    ensureDir(uploadDir)

    const filePath = path.join(uploadDir, fileName)
    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(filePath, buffer)

    const url = `/images/${group}/${fileName}`
    return { success: true, data: url }
}

export async function listImages(
    group: ImageGroup
): Promise<IActionResponse<string[]>> {
    const dir = path.join(process.cwd(), 'public', 'images', group)
    if (!fs.existsSync(dir)) {
        return { success: true, data: [] }
    }
    const files = fs.readdirSync(dir).filter((f) => {
        const ext = f.split('.').pop()?.toLowerCase() ?? ''
        return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)
    })
    const urls = files.map((f) => `/images/${group}/${f}`)
    return { success: true, data: urls }
}

export async function deleteImage(
    url: string
): Promise<IActionResponse<undefined>> {
    const match = url.match(/^\/images\/(server|item|banner)\/[^/]+$/)
    if (!match) {
        return { success: false, error: 'ตำแหน่งของภาพไม่ถูกต้อง' }
    }

    const filePath = path.join(process.cwd(), 'public', url)

    if (!fs.existsSync(filePath)) {
        return { success: false, error: 'ไม่พบไฟล์' }
    }

    fs.unlinkSync(filePath)
    return { success: true }
}
