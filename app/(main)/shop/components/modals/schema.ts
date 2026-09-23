import z from "zod";
import { CommonTextRegex, hostRegex } from "@/app/utils/regex";

export const ServerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "ชื่อเซิร์ฟเวอร์ขั้นต่ำ 3 ตัวอักษร")
        .max(25, "ชื่อเซิร์ฟเวอร์ไม่เกิน 25 ตัวอักษร")
        .regex(CommonTextRegex, "ห้ามใช้ตัวอักษรพิเศษ"),
    subtitle: z
        .string()
        .trim()
        .max(25, "คำอธิบายไม่เกิน 25 ตัวอักษร")
        .regex(CommonTextRegex, "ห้ามใช้ตัวอักษรพิเศษ")
        .optional(),
    imageUrl: z
        .string()
        .optional(),
    rconHost: z
        .string()
        .trim()
        .min(1, "กรอก IP Address หรือ Domain")
        .max(255, "IP Address ไม่เกิน 255 ตัวอักษร")
        .regex(hostRegex, "กรอก RCON Host ให้ถูกต้อง"),
    rconPort: z
        .string()
        .refine((value) => {
            const num = Number(value)
            return num >= 1 && num <= 65535 && Number.isInteger(num)
        }, "Port ต้องเป็นตัวเลขในช่วง 1 - 65535"),
    rconPassword: z
        .string()
        .min(1, "กรอกรหัสผ่าน RCON")
        .max(255, "รหัสผ่าน RCON ไม่เกิน 255 ตัวอักษร"),
});

export const ItemSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "ชื่อไอเทมขั้นต่ำ 3 ตัวอักษร")
        .max(50, "ชื่อไอเทมไม่เกิน 50 ตัวอักษร")
        .regex(CommonTextRegex, "ห้ามใช้ตัวอักษรพิเศษ"),
    description: z
        .string()
        .trim()
        .max(200, "รายละเอียดไอเทมไม่เกิน 200 ตัวอักษร")
        .regex(CommonTextRegex, "ห้ามใช้ตัวอักษรพิเศษ"),
    imageUrl: z
        .string()
        .optional(),
    command: z.string().min(1, "กรอกคำสั่งเสกไอเท็ม"),
    price: z
        .string()
        .refine((value) => {
            const num = Number(value)
            return num >= 0 && Number.isInteger(num)
        }, "ราคาต้องเป็นตัวเลข และไม่ติดลบ")
        .refine((value) => {
            const num = Number(value)
            return num <= 1000000
        }, "ราคาไม่เกิน 1,000,000"),
    amount: z
        .string()
        .refine((value) => {
            const num = Number(value)
            return num >= 1 && Number.isInteger(num)
        }, "ต้องเรียกคำสั่งอย่างน้อย 1 ครั้ง"),
    category: z
        .string()
        .trim()
        .min(3, "ชื่อหมวดหมู่ขั้นต่ำ 3 ตัวอักษร")
        .max(25, "ชื่อหมวดหมู่ไม่เกิน 25 ตัวอักษร")
        .regex(CommonTextRegex, "ห้ามใช้ตัวอักษรพิเศษ"),
})

export type ServerFormValues = z.infer<typeof ServerSchema>
export type ItemFormValues = z.infer<typeof ItemSchema>