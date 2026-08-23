import { Item } from "@/app/generated/prisma/client";

export interface IItemFilter {
    serverId?: number
}

export interface IItem extends Omit<Item, "command" | "serverId"> { }