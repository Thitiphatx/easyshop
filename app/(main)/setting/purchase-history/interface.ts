
import { ISectionCommonProps } from "@/app/interface";
import { PurchaseFilterFormValues } from "./schema";

export interface ITablePurchaseFilterProps extends ISectionCommonProps {
    fetchPurchase: (filters: PurchaseFilterFormValues) => Promise<void>
}