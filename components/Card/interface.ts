import { HTMLAttributes } from "react"

export interface ICardProps extends HTMLAttributes<HTMLDivElement> {
    cardTitle?: React.ReactNode
    cardFooter?: React.ReactNode
}