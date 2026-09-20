import { Prisma } from "@/app/generated/prisma/client"

export type IClientSetting = Prisma.SettingGetPayload<{
    select: {
        enableBank: true,
        enableTruewallet: true,
        enableDirectTruewallet: true,
        siteName: true,
        siteDesc: true,
        logo: true,
        serverIp: true,
        serverImageUrl: true,
        serverName: true,
        serverDesc: true,
        pointMultiplier: true,
        truewalletPhoneNumber: true
    }
}>