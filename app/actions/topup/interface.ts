import { Prisma } from "@/app/generated/prisma/client";
import { TopupFilterFormValues } from "@/app/(main)/webshop/topup/schema";

export interface ITopupFilter extends TopupFilterFormValues {
    playerName?: string
    page?: number
    size?: number
}

export type ITopup = Prisma.TopupGetPayload<{
    select: {
        id: true;
        amount: true;
        pointsAdded: true;
        channel: true;
        status: true;
        reference: true;
        createdAt: true;
        user: {
            select: {
                username: true;
            };
        };
    };
}>;

export interface ITopDonateFilter {
    top?: number
    type: 'all' | 'month'
}

export interface ITopDonate {
    rank: number
    username: string
    amount: number
}