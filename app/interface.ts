import { Dispatch, SetStateAction } from "react"

export type ColorVariant = "Green" | "Gold" | "Blue" | "Purple" | "Default";

export interface IModalCommonProps {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}