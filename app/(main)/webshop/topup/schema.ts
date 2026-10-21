import { phoneRegex } from "@/app/utils/regex"
import z from "zod"

export const PromotionSchema = z.object({
    pointMultiplier: z.number().min(1, "กรุณาเลือกตัวคูณ").max(10)
})

export const TrueWalletSchema = z.object({
    enableTruewallet: z.boolean(),
    truewalletPhoneNumber:
        z.string()
            .refine((value) => {
                if (!value) return true
                return phoneRegex.test(value)
            }, "กรุณาระบุเบอร์โทรศัพท์ TrueMoney Wallet ที่ถูกต้อง")
            .nullable()
            .optional(),
})

export const EasyslipSchema = z.object({
    enableBank: z.boolean(),
    easyslipApiKey: z.string().nullable().optional(),
})

export const TopupFilterSchema = z.object({
    search: z.string().optional(),
    status: z.enum(['SUCCESS', 'PENDING', 'FAILED']).optional(),
    sort: z.enum(['id', 'username', 'channel', 'amount', 'pointsAdded', 'status', 'createdAt']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
})

export type PromotionFormValues = z.infer<typeof PromotionSchema>
export type TrueWalletFormValues = z.infer<typeof TrueWalletSchema>
export type EasyslipFormValues = z.infer<typeof EasyslipSchema>
export type TopupFilterFormValues = z.infer<typeof TopupFilterSchema>