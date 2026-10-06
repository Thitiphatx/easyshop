
import { ISectionCommonProps } from "@/app/interface";
import { UserFilterFormValues } from "./schema";

export interface ITableUserFilterProps extends ISectionCommonProps {
    fetchUser: (filters: UserFilterFormValues) => Promise<void>
}