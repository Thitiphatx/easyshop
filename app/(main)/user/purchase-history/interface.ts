import { IActionResponse } from "@/app/actions/interface";
import { ITransaction } from "@/app/actions/transaction/interface";

export interface IPurchaseHistoryProps {
    getHistory: (page: number, size: number) => Promise<IActionResponse<ITransaction[]>>
}