import { numberRegex } from "@/app/utils/regex"
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
                return numberRegex.test(value)
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

export const SlipOkSchema = z.object({
    enableBank: z.boolean(),
    slipOkBranchId: z.string().max(7).refine((value) => {
        if (!value) return true
        return numberRegex.test(value)
    }, "กรุณากรอกรหัสสาขาที่ถูกต้อง").nullable().optional(),
    slipOkApiKey: z.string().max(255).nullable().optional(),
    bank: z.string().trim().max(255).nullable().optional(),
    bankName: z.string().trim().max(255).nullable().optional(),
    bankNumber: z.string().trim().max(25).nullable().optional(),
})

export type PromotionFormValues = z.infer<typeof PromotionSchema>
export type TrueWalletFormValues = z.infer<typeof TrueWalletSchema>
export type EasyslipFormValues = z.infer<typeof EasyslipSchema>
export type TopupFilterFormValues = z.infer<typeof TopupFilterSchema>
export type SlipOkFormValues = z.infer<typeof SlipOkSchema>
