import { ColorVariant } from "@/app/interface";

export type ButtonVariant = "Link" | "Solid" | "Outline" | "Ghost" | "Retro";
export type ButtonIconPosition = "start" | "end"

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    color?: ColorVariant
    icon?: React.ReactNode
    iconPosition?: ButtonIconPosition
    isIconOnly?: boolean
    isActive?: boolean
    block?: boolean
}