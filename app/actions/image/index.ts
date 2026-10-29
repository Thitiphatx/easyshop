'use server'

import fs from 'fs'
import path from 'path'
import { IActionResponse } from '../interface'
import { ImageGroup } from './interface'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

function getPublicImagesDir(): string {
    return path.resolve(process.cwd(), 'public', 'images')
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

    try {
        const publicImagesDir = getPublicImagesDir()
        const groupDir = path.resolve(publicImagesDir, group)

        if (!groupDir.startsWith(publicImagesDir)) {
            return { success: false, error: 'กลุ่มรูปภาพไม่ถูกต้อง' }
        }

        await fs.promises.mkdir(groupDir, { recursive: true })

        const ext = file.name.split('.').pop() ?? 'jpg'
        const rawName = file.name.substring(
            0,
            file.name.lastIndexOf('.') !== -1 ? file.name.lastIndexOf('.') : file.name.length
        )
        const sanitizedName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_')
        const fileName = `${Date.now()}-${sanitizedName || 'image'}.${ext}`
        const targetPath = path.resolve(groupDir, fileName)

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        await fs.promises.writeFile(targetPath, buffer)

        const fileUrl = `/images/${group}/${fileName}`
        return { success: true, data: fileUrl }
    } catch (err: unknown) {
        console.error('Local upload error:', err)
        const message = err instanceof Error ? err.message : 'อัปโหลดรูปภาพล้มเหลว'
        return { success: false, error: message }
    }
}

export async function listImages(
    group: ImageGroup
): Promise<IActionResponse<string[]>> {
    try {
        const publicImagesDir = getPublicImagesDir()
        const groupDir = path.resolve(publicImagesDir, group)

        if (!groupDir.startsWith(publicImagesDir)) {
            return { success: false, error: 'กลุ่มรูปภาพไม่ถูกต้อง' }
        }

        if (!fs.existsSync(groupDir)) {
            return { success: true, data: [] }
        }

        const entries = await fs.promises.readdir(groupDir, { withFileTypes: true })
        const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'])

        const filesWithStats = await Promise.all(
            entries
                .filter((entry) => entry.isFile() && !entry.name.startsWith('.'))
                .filter((entry) => imageExtensions.has(path.extname(entry.name).toLowerCase()))
                .map(async (entry) => {
                    const filePath = path.resolve(groupDir, entry.name)
                    const stat = await fs.promises.stat(filePath)
                    return {
                        name: entry.name,
                        mtime: stat.mtimeMs,
                    }
                })
        )

        filesWithStats.sort((a, b) => b.mtime - a.mtime)

        const urls = filesWithStats.map((file) => `/images/${group}/${file.name}`)
        return { success: true, data: urls }
    } catch (err: unknown) {
        console.error('Local list images error:', err)
        const message = err instanceof Error ? err.message : 'ไม่สามารถดึงข้อมูลรูปภาพได้'
        return { success: false, error: message }
    }
}

export async function deleteImage(
    url: string
): Promise<IActionResponse<undefined>> {
    try {
        if (!url) {
            return { success: false, error: 'ไม่พบตำแหน่งรูปภาพ' }
        }

        let cleanPath = url
        try {
            if (url.startsWith('http://') || url.startsWith('https://')) {
                const parsed = new URL(url)
                cleanPath = parsed.pathname
            }
        } catch {
            // ignore
        }

        if (cleanPath.startsWith('/api/images/')) {
            cleanPath = cleanPath.slice('/api/images/'.length)
        } else if (cleanPath.startsWith('/images/')) {
            cleanPath = cleanPath.slice('/images/'.length)
        } else if (cleanPath.startsWith('images/')) {
            cleanPath = cleanPath.slice('images/'.length)
        } else if (cleanPath.startsWith('/')) {
            cleanPath = cleanPath.slice(1)
        }

        const publicImagesDir = getPublicImagesDir()
        const filePath = path.resolve(publicImagesDir, cleanPath)

        if (!filePath.startsWith(publicImagesDir)) {
            return { success: false, error: 'ตำแหน่งของภาพไม่ถูกต้อง' }
        }

        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath)
        }

        return { success: true }
    } catch (err: unknown) {
        console.error('Local delete image error:', err)
        const message = err instanceof Error ? err.message : 'ลบรูปภาพล้มเหลว'
        return { success: false, error: message }
    }
}

