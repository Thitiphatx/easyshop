import z from "zod";

export const BankSchema = z.object({
    imageSlip: z.file().nullable(),
    agree: z.literal(true, { error: 'ต้องยอมรับเงื่อนไข' })
})

export type BankFormValues = z.infer<typeof BankSchema>