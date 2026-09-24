import z from "zod";

export const TrueWalletSchema = z.object({
    giftUrl: z.url({ error: "ลิงก์ซองของขวัญไม่ถูกต้อง" }),
    agree: z.literal(true, { error: 'กรุณายอมรับเงื่อนไข' })
})

export type TrueWalletFormValues = z.infer<typeof TrueWalletSchema>