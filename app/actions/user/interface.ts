import { Prisma } from "@/app/generated/prisma/client";
import { UserFilterFormValues } from "@/app/(main)/setting/users/schema";


export interface IUserFilter extends UserFilterFormValues {
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
        isAdmin: true;
        uuid: true;
        playerPoints: {
            select: {
                points: true
            }
        }
    };
}>;