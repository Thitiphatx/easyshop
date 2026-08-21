"use server"

import bcrypt from 'bcryptjs';
import { IRequestAuthenticate } from "./interface";
import { SignInSchema } from '@/components/Auth/schema';
import { prisma } from '@/lib/prisma'
import { createSession } from '../session';
import { IActionResponse } from '../interface';
import { ISessionPayload } from '../session/interface';

export async function authenticate(request: IRequestAuthenticate): Promise<IActionResponse<ISessionPayload>> {
    try {
        const validatedFields = SignInSchema.safeParse(request)

        if (!validatedFields.success) {
            return {
                success: false,
                error: validatedFields.error.issues[0]?.message || 'ข้อมูลไม่ถูกต้อง',
            };
        }

        const { username, password } = validatedFields.data;
        const user = await prisma.authMe.findFirst({
            where: { username },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return {
                success: false,
                error: 'Username หรือ Password ไม่ถูกต้อง',
            };
        }

        const sessionPayload: ISessionPayload = {
            id: user.id,
            username: user.username,
            profileImageUrl: "",
            isAdmin: Boolean(user.isAdmin),
        }

        await createSession(sessionPayload);

        return {
            success: true,
            data: sessionPayload
        };
    } catch {
        return {
            success: false,
            error: "ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้"
        }
    }
}
