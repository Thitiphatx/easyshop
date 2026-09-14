import { InputHTMLAttributes } from "react";

export interface ICheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    variant?: 'normal' | 'switch'
}