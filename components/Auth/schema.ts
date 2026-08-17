import z from "zod";

export const SignInSchema = z.object({
    username: z.string({ error: "กรอกชื่อในเกม" }).min(3, "ชื่อในเกมยาวขั้นต่ำ 3 ตัวอักษร").max(16, "ชื่อในเกมยาวสูงสุด 16 ตัวอักษร").regex(/^[a-zA-Z0-9_]+$/, "ชื่อในเกมต้องเป็นตัวอักษรภาษาอังกฤษ ตัวเลข หรือ _ เท่านั้น"),
    password: z.string({ error: 'กรอกรหัสผ่านเดียวกับในเซิร์ฟเวอร์ (ไม่ใช่รหัสไอดีแท้)' }).min(8, "รหัสผ่านขั้นต่ำ 8 ตัวอักษร")
})

export type SignInFormValues = z.infer<typeof SignInSchema>