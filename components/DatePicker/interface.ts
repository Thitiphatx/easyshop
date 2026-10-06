import { InputHTMLAttributes } from "react";

export interface IDatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    isError?: boolean
}
