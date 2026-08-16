import { IButtonProps } from "../Button/interface";

export interface ISelectItem {
    label: string,
    onClick?: () => Promise<void>;
    href?: string
}

export interface ISelectProps extends IButtonProps {
    items?: ISelectItem[]
}