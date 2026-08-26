import z from "zod";

export const ProfileSchema = z.object({
    email: z.string().min(1, 'กรอกอีเมลล์'),
})

export type ProfileFormValues = z.infer<typeof ProfileSchema>