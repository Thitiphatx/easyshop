import z from "zod";

export const ServerSchema = z.object({
    ipv4: z.string(),
    port: z.string(),
    name: z.string(),
    imageUrl: z.url()
})

export type ServerFormValues = z.infer<typeof ServerSchema> 