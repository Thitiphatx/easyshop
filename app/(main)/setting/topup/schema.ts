import z from "zod"

export const PromotionSchema = z.object({
    pointMultiplier: z.number().min(1, "กรุณาเลือกตัวคูณ").max(10)
})

export const MethodSchema = z.object({
    enableTruewallet: z.boolean(),
    enableBank: z.boolean()
})

export const EasyslipSchema = z.object({
    apiKey: z.string().nullable()
})

export type PromotionFormValues = z.infer<typeof PromotionSchema>
export type MethodFormValues = z.infer<typeof MethodSchema>
export type EasyslipFormValues = z.infer<typeof EasyslipSchema>