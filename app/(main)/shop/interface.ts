import { IModalCommonProps } from "@/app/interface"
import { IItem } from "../../actions/item/interface"
import { Item, Server } from "../../generated/prisma/client"

export interface IModalServerProps extends IModalCommonProps {
    isEdit?: boolean
    serverInfo?: Server
    getServerList: () => Promise<void>
}

export interface IModalItemProps extends IModalCommonProps {
    isEdit?: boolean
    itemInfo?: Item
    getItemList: () => Promise<void>
    serverId: number
}

export interface IItemSectionProps {
}

export interface IServerSectionProps {
}

export interface IModalViewItemProps extends IModalCommonProps {
    itemInfo: IItem
}