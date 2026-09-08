import { Prisma } from "@/app/generated/prisma/client";

const displaySettingSelect = {
    id: true,
    siteName: true,
    favicon: true,
    logo: true,
} satisfies Prisma.SettingSelect;

const serverSettingSelect = {
    id: true,
    serverIp: true,
    serverName: true,
} satisfies Prisma.SettingSelect;

export type IDisplaySetting = Prisma.SettingGetPayload<{ select: typeof displaySettingSelect }>;
export type IServerSetting = Prisma.SettingGetPayload<{ select: typeof serverSettingSelect }>;

export { displaySettingSelect, serverSettingSelect };
