import { IButtonProps } from "../Button/interface";

export interface IDropdownItem {
    label: string,
    onClick?: () => Promise<void> | void;
    className?: string
    isAdmin?: boolean
    hidden?: boolean
}

export type ISelectItem = IDropdownItem;

export interface IDropdownProps extends IButtonProps {
    items?: IDropdownItem[]
}
