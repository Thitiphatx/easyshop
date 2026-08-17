import z from "zod";

export const ServerSchema = z.object({
    rconHost: z.string().min(1, 'กรอก IP Address'),
    rconPort: z.string().min(1, 'กรอก Port'),
    rconPassword: z.string().min(1, 'กรอกรหัสผ่าน RCON'),
    name: z.string().min(1, 'กรอกชื่อเซิร์ฟเวอร์'),
    imageFile: z.instanceof(File, { message: 'กรุณาเลือกรูปภาพ' }).nullable(),
})

export const ItemSchema = z.object({
    name: z.string(),
    imageUrl: z.url(),
    command: z.string(),
    price: z.number(),
    amount: z.number(),
})

export type ServerFormValues = z.infer<typeof ServerSchema>
export type ItemFormValues = z.infer<typeof ItemSchema>