import { Prisma, Transaction } from "@/app/generated/prisma/client";

export interface ITransactionFilter {
    playerName?: string
    page?: number
    size?: number
}

export type ITransaction = Prisma.TransactionGetPayload<{
    select: {
        id: true;
        username: true;
        itemId: true;
        serverId: true;
        pricePaid: true;
        createdAt: true;
        item: {
            select: {
                name: true;
                imageUrl: true;
            };
        };
        server: {
            select: {
                name: true;
            };
        };
    };
}>;

export interface ICreateTransactionRequest extends Omit<Transaction, "id"> { }