import React, { HTMLAttributes } from "react"

export interface IModalProps extends HTMLAttributes<HTMLDivElement> {
    modalTitle?: React.ReactNode
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    canClose?: boolean
    canClickOutsideClose?: boolean
}
