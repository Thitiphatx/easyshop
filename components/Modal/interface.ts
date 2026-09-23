import React, { HTMLAttributes } from "react"

export interface IModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
    modalTitle?: React.ReactNode
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    canClose?: boolean
    canClickOutsideClose?: boolean
    onClick?: () => Promise<any> | any
}
