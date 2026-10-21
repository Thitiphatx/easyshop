import { NextRequest, NextResponse } from 'next/server'
import { get } from '@vercel/blob'
import path from 'path'
import fs from 'fs'

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path: segments } = await context.params
    if (!segments || segments.length === 0) {
        return new NextResponse('Not Found', { status: 404 })
    }

    const relPath = segments.join('/')
    const blobPathname = relPath.startsWith('images/') ? relPath : `images/${relPath}`

    try {
        const ifNoneMatch = request.headers.get('if-none-match') ?? undefined
        const blobResult = await get(blobPathname, {
            access: 'public',
            ifNoneMatch,
        })

        if (blobResult) {
            if (blobResult.statusCode === 304) {
                return new NextResponse(null, { status: 304 })
            }

            if (blobResult.stream) {
                const headers = new Headers()
                if (blobResult.blob.contentType) {
                    headers.set('Content-Type', blobResult.blob.contentType)
                }
                headers.set(
                    'Cache-Control',
                    blobResult.blob.cacheControl || 'public, max-age=31536000, immutable'
                )
                if (blobResult.blob.etag) {
                    headers.set('ETag', blobResult.blob.etag)
                }
                if (blobResult.blob.size) {
                    headers.set('Content-Length', blobResult.blob.size.toString())
                }

                return new NextResponse(blobResult.stream as unknown as ReadableStream, {
                    status: 200,
                    headers,
                })
            }
        }
    } catch (err) {
        console.warn('Failed to fetch blob from Vercel Blob for', blobPathname, err)
    }

    // Fallback: Check local public/images folder if legacy file exists
    const localFile = path.join(process.cwd(), 'public', 'images', ...segments)
    if (fs.existsSync(localFile)) {
        const fileBuffer = fs.readFileSync(localFile)
        const ext = path.extname(localFile).toLowerCase().replace('.', '')
        const mimeMap: Record<string, string> = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            webp: 'image/webp',
            gif: 'image/gif',
            svg: 'image/svg+xml',
        }
        const contentType = mimeMap[ext] || 'application/octet-stream'

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        })
    }

    return new NextResponse('Image Not Found', { status: 404 })
}
