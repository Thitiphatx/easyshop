import z from "zod";

export const DisplaySchema = z.object({
    siteName: z.string().min(1, 'กรอกชื่อเว็บช็อป'),
    siteDesc: z.string().optional(),
    logo: z.string().nullable().optional(),
})

export const ServerSchema = z.object({
    serverImageUrl: z.string().nullable().optional(),
    serverName: z.string().min(1, 'กรอกชื่อเซิร์ฟเวอร์'),
    serverDesc: z.string().optional(),
    ip: z.string().min(1, 'กรอก IP เซิร์ฟเวอร์'),
})

export const BannerSchema = z.object({
    imageUrl: z.string().min(1, 'กรุณาเลือกรูปภาพ Banner'),
    link: z.string().optional(),
})

export type DisplayFormValues = z.infer<typeof DisplaySchema>
export type ServerFormValues = z.infer<typeof ServerSchema>
export type BannerFormValues = z.infer<typeof BannerSchema>