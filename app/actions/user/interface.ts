import { Prisma } from "@/app/generated/prisma/client";


export interface IUserFilter {
    playerName?: string
    page?: number
    size?: number
}

export type IUser = Prisma.AuthMeGetPayload<{
    select: {
        id: true;
        username: true;
        ip: true;
        lastlogin: true;
        email: true;
        isLogged: true;
        uuid: true;
        playerPoints: {
            select: {
                points: true
            }
        }
    };
}>;