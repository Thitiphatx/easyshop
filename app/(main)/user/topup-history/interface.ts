import { ISectionCommonProps } from "@/app/interface";
import { TopupFilterFormValues } from "./schema";

export interface ITableTopupFilterProps extends ISectionCommonProps {
    fetchTopups: (filters: TopupFilterFormValues) => Promise<void>
}
