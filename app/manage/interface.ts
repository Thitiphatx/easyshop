import { IModalCommonProps } from "@/app/interface"

export interface IServer {

}

export interface IServerItem {
    id: string
    name: string
    sub?: string
    imageUrl: string
}

export interface IModalServerProps extends IModalCommonProps {
    isEdit?: boolean
    serverInfo?: IServerItem
}

export interface IProductItem {
    id: number
    imageUrl?: string
    name: string
    price: number
    category: string
    totalPurchase: number
}