"use server"
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { ISessionPayload } from './interface';
import { IActionResponse } from '../interface';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default_secret_key_change_me_later_123456'
);

export async function createSession(payload: ISessionPayload) {
    const token = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(SECRET_KEY);

    const cookieStore = await cookies();
    cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
    });
}

export async function getSession(): Promise<ISessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload as unknown as ISessionPayload;
    } catch (error) {
        return null;
    }
}

export async function deleteSession(): Promise<IActionResponse<void>> {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('session');
        return {
            success: true
        }
    } catch {
        return {
            success: false,
            error: "เกิดข้อผิดพลาดขณะดำเนินการ"
        }
    }
}