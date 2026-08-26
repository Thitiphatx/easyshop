import { IButtonProps } from "../Button/interface";

export interface ISelectItem {
    label: string,
    onClick?: () => Promise<void> | void;
    className?: string
    isAdmin?: boolean
}

export interface ISelectProps extends IButtonProps {
    items?: ISelectItem[]
}