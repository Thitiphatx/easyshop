import { IModalCommonProps } from "@/app/interface"
import { Server } from "../generated/prisma/client"
import { ISessionPayload } from "../actions/session/interface"
import { IItem } from "../actions/item/interface"

export interface IModalServerProps extends IModalCommonProps {
    isEdit?: boolean
    serverInfo?: Server
    getServerList: () => Promise<void>
}

export interface IModalItemProps extends IModalCommonProps {
    isEdit?: boolean
    itemInfo?: IItem
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