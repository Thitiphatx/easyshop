import z from "zod";

export const ServerSchema = z.object({
    rconHost: z.string().min(1, 'กรอก IP Address'),
    rconPort: z.string().min(1, 'กรอก Port'),
    rconPassword: z.string().min(1, 'กรอกรหัสผ่าน RCON'),
    name: z.string().min(1, 'กรอกชื่อเซิร์ฟเวอร์'),
    subtitle: z.string().nullable(),
    imageUrl: z.string().nullable(),
})

export const ItemSchema = z.object({
    name: z.string(),
    description: z.string(),
    imageUrl: z.string().nullable(),
    command: z.string(),
    price: z.string(),
    amount: z.string().min(1, 'ต้องเรียกคำสั่งอย่างน้อย 1 ครั้ง'),
    category: z.string(),
})

export type ServerFormValues = z.infer<typeof ServerSchema>
export type ItemFormValues = z.infer<typeof ItemSchema>