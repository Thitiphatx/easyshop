export interface ISendItemRequest {
    serverId: number
    itemId: number
    quantity: number
    playerName: string
}

export interface ISendCommandRequest {
    serverId: number
    command: string
}