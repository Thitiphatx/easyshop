"use server"

import bcrypt from 'bcryptjs';
import { IRequestAuthenticate, IResponseAuthenticate } from "./interface";
import { SignInSchema } from '@/components/Auth/schema';
import { prisma } from '@/lib/prisma'
import { createSession } from '../session';

export async function authenticate(request: IRequestAuthenticate): Promise<IResponseAuthenticate> {
    const validatedFields = SignInSchema.safeParse(request)

    if (!validatedFields.success) {
        // ดึง fieldErrors จาก issues โดยตรง (ไม่ติด Deprecated)
        const fieldErrors: Record<string, string[]> = {};

        for (const issue of validatedFields.error.issues) {
            const fieldName = issue.path[0]?.toString();
            if (fieldName) {
                if (!fieldErrors[fieldName]) {
                    fieldErrors[fieldName] = [];
                }
                fieldErrors[fieldName].push(issue.message);
            }
        }

        return {
            isSuccess: false,
            error: validatedFields.error.issues[0]?.message || 'ข้อมูลไม่ถูกต้อง',
            fieldErrors,
        };
    }

    const { username, password } = validatedFields.data;
    const user = await prisma.authMe.findFirst({
        where: { username },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return {
            isSuccess: false,
            error: 'Username หรือ Password ไม่ถูกต้อง',
        };
    }
    
    const sessionPayload = {
        id: user.id,
        username: user.username,
        profileImageUrl: "",
        isAdmin: Boolean(user.isAdmin),
    }

    await createSession(sessionPayload);

    return { isSuccess: true, session: sessionPayload };
}