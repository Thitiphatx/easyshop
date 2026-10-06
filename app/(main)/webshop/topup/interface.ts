import { ISectionCommonProps } from "@/app/interface";
import { TopupFilterFormValues } from "./schema";

export interface ITrueWalletSectionProps extends ISectionCommonProps { }
export interface IEasySlipSectionProps extends ISectionCommonProps { }
export interface ITopupHistorySectionProps extends ISectionCommonProps { }

export interface ITableTopupFilterProps extends ISectionCommonProps {
    fetchTopups: (filters: TopupFilterFormValues) => Promise<void>
}