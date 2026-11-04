import z from "zod";

export const BankSchema = z.object({
    imageSlip: z.file().nullable(),
    agree: z.literal(true, { error: 'ต้องยอมรับข้อตกลง' })
})

export type BankFormValues = z.infer<typeof BankSchema>