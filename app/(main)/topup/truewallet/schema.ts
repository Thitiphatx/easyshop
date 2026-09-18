import z from "zod";

export const TrueWalletSchema = z.object({
    giftUrl: z.url({ error: "ลิงก์ไม่ถูกต้อง" }),
    agree: z.literal(true, { error: 'ต้องยอมรับเงื่อนไข' })
})

export type TrueWalletFormValues = z.infer<typeof TrueWalletSchema>