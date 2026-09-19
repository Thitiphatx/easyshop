import z from "zod"

export const PromotionSchema = z.object({
    pointMultiplier: z.number().min(1, "กรุณาเลือกตัวคูณ").max(10)
})

export const TrueWalletSchema = z.object({
    enableDirectTruewallet: z.boolean(),
    truewalletPhoneNumber: z.string().refine((value) => /^[0-9]{10}$/.test(value), "กรุณาระบุเบอร์โทรศัพท์ TrueMoney Wallet ที่ถูกต้อง"),
})

export const EasyslipSchema = z.object({
    enableTruewallet: z.boolean(),
    enableBank: z.boolean(),
    easyslipApiKey: z.string().nullable().optional(),
})

export type PromotionFormValues = z.infer<typeof PromotionSchema>
export type TrueWalletFormValues = z.infer<typeof TrueWalletSchema>
export type EasyslipFormValues = z.infer<typeof EasyslipSchema>