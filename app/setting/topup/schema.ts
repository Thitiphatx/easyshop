import z from "zod"

export const PromotionSchema = z.object({
    pointMultiplier: z.number().min(1, "กรุณาเลือกตัวคูณ").max(10)
})

export const MethodSchema = z.object({
    enableTruewallet: z.boolean(),
    enableBank: z.boolean()
})

export type PromotionFormValues = z.infer<typeof PromotionSchema>
export type MethodFormValues = z.infer<typeof MethodSchema>