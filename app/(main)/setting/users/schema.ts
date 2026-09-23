import z from "zod"

export const UserFilterSchema = z.object({
    search: z.string().optional(),
    isLogged: z.boolean().optional(),
    isAdmin: z.boolean().optional(),
    sort: z.enum(['id', 'username', 'lastlogin', 'email', 'points']).optional(),
    order: z.enum(['asc', 'desc']).optional()
})

export type UserFilterFormValues = z.infer<typeof UserFilterSchema>