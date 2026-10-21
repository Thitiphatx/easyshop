import { Prisma } from "@/app/generated/prisma/client";
import { UserFilterFormValues } from "@/app/(main)/webshop/users/schema";


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
        points: true
    };
}>;