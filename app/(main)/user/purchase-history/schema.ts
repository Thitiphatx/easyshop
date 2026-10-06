import z from "zod"

export const PurchaseFilterSchema = z.object({
    search: z.string().optional(),
    sort: z.enum(['id', 'serverName', 'itemName', 'pricePaid', 'createdAt']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
})

export type PurchaseFilterFormValues = z.infer<typeof PurchaseFilterSchema>
