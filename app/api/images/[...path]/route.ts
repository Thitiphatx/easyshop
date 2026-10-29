import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

const MIME_MAP: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
}

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path: segments } = await context.params
    if (!segments || segments.length === 0) {
        return new NextResponse('Not Found', { status: 404 })
    }

    // Handle whether path starts with 'images' or directly with group
    const cleanSegments = segments[0] === 'images' ? segments.slice(1) : segments
    const publicImagesDir = path.resolve(process.cwd(), 'public', 'images')
    const filePath = path.resolve(publicImagesDir, ...cleanSegments)

    // Security check: ensure path is within public/images directory
    if (!filePath.startsWith(publicImagesDir)) {
        return new NextResponse('Forbidden', { status: 403 })
    }

    try {
        if (!fs.existsSync(filePath)) {
            return new NextResponse('Image Not Found', { status: 404 })
        }

        const stat = await fs.promises.stat(filePath)
        if (!stat.isFile()) {
            return new NextResponse('Not Found', { status: 404 })
        }

        const etag = `W/"${stat.size}-${stat.mtimeMs}"`
        const ifNoneMatch = request.headers.get('if-none-match')
        if (ifNoneMatch && ifNoneMatch === etag) {
            return new NextResponse(null, { status: 304 })
        }

        const fileBuffer = await fs.promises.readFile(filePath)
        const ext = path.extname(filePath).toLowerCase().replace('.', '')
        const contentType = MIME_MAP[ext] || 'application/octet-stream'

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Length': stat.size.toString(),
                'ETag': etag,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        })
    } catch (err) {
        console.error('Failed to serve local image:', filePath, err)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

