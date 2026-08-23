import { Transaction } from "@/app/generated/prisma/client";

export interface ITransactionFilter {
    playerName?: string
    page?: number
    size?: number
}

export interface ITransaction extends Omit<Transaction, "executedCommand"> {
}

export interface ICreateTransactionRequest extends Omit<Transaction, "id"> { }