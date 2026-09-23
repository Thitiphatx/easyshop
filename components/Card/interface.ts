import { HTMLAttributes } from "react"

export interface ICardProps extends HTMLAttributes<HTMLDivElement> {
    cardTitle?: React.ReactNode
    cardFooter?: React.ReactNode
    isPressable?: boolean
    isLoading?: boolean
    childrenClassName?: string
    onClick?: () => Promise<any> | any
}