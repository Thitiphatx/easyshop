import z from "zod"

export const TopupFilterSchema = z.object({
    search: z.string().optional(),
    status: z.enum(['SUCCESS', 'PENDING', 'FAILED']).optional(),
    sort: z.enum(['id', 'channel', 'amount', 'pointsAdded', 'status', 'createdAt']).optional(),
    order: z.enum(['asc', 'desc']).optional()
})

export type TopupFilterFormValues = z.infer<typeof TopupFilterSchema>
