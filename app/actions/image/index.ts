'use server'

import fs from 'fs'
import path from 'path'
import { put, list, del } from '@vercel/blob'
import { IActionResponse } from '../interface'
import { ImageGroup } from './interface'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

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
        const ext = file.name.split('.').pop() ?? 'jpg'
        const rawName = file.name.substring(0, file.name.lastIndexOf('.') !== -1 ? file.name.lastIndexOf('.') : file.name.length)
        const sanitizedName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_')
        const fileName = `${Date.now()}-${sanitizedName || 'image'}.${ext}`
        const pathname = `images/${group}/${fileName}`

        await put(pathname, file, {
            access: 'public',
            contentType: file.type,
        })

        const proxyUrl = `/api/images/${group}/${fileName}`
        return { success: true, data: proxyUrl }
    } catch (err: unknown) {
        console.error('Blob upload error:', err)
        const message = err instanceof Error ? err.message : 'อัปโหลดรูปภาพล้มเหลว'
        return { success: false, error: message }
    }
}

export async function listImages(
    group: ImageGroup
): Promise<IActionResponse<string[]>> {
    try {
        const { blobs } = await list({
            prefix: `images/${group}/`,
        })

        const sortedBlobs = [...blobs].sort(
            (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        )

        const urls = sortedBlobs.map((b) => {
            const subPath = b.pathname.startsWith('images/')
                ? b.pathname.slice('images/'.length)
                : b.pathname
            return `/api/images/${subPath}`
        })
        return { success: true, data: urls }
    } catch (err: unknown) {
        console.error('Blob list error:', err)
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

        // Direct Vercel Blob URL
        if (url.startsWith('http://') || url.startsWith('https://')) {
            await del(url)
            return { success: true }
        }

        // Internal Next.js proxy URL (/api/images/...)
        const apiMatch = url.match(/^\/api\/images\/(.+)$/)
        if (apiMatch) {
            const relPath = apiMatch[1]
            const blobPathname = relPath.startsWith('images/') ? relPath : `images/${relPath}`
            await del(blobPathname)
            return { success: true }
        }

        // Legacy local file (/images/...)
        const match = url.match(/^\/images\/(server|item|banner|brand|others)\/[^/]+$/)
        if (match) {
            const relPath = url.replace(/^\//, '')
            try {
                await del(relPath)
            } catch {
                // Ignore if not in Blob
            }

            const filePath = path.join(process.cwd(), 'public', url)
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }
            return { success: true }
        }

        return { success: false, error: 'ตำแหน่งของภาพไม่ถูกต้อง' }
    } catch (err: unknown) {
        console.error('Blob delete error:', err)
        const message = err instanceof Error ? err.message : 'ลบรูปภาพล้มเหลว'
        return { success: false, error: message }
    }
}

