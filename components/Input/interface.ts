import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
    isError?: boolean
}

export interface ITextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    isError?: boolean
}