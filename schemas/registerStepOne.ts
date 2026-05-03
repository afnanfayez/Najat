import { z } from 'zod'

export const registerStepOneSchema = z.object({
  name: z.string().trim().min(1, 'يرجى إدخال الاسم'),
  phone: z.string().trim().min(1, 'يرجى إدخال رقم الجوال'),
  email: z
    .string()
    .trim()
    .min(1, 'يرجى إدخال البريد الإلكتروني')
    .email('البريد الإلكتروني غير صالح'),
})

export type RegisterStepOneValues = z.infer<typeof registerStepOneSchema>
