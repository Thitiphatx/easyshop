import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default_secret_key_change_me_later_123456'
)

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('session')?.value

    if (!token) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    try {
        const { payload } = await jwtVerify(token, SECRET_KEY)

        // /setting/* requires admin
        if (pathname.startsWith('/setting') && !payload.isAdmin) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        return NextResponse.next()
    } catch {
        return NextResponse.redirect(new URL('/', request.url))
    }
}

export const config = {
    matcher: ['/setting/:path*', '/user/:path*', '/topup/:path*'],
}
