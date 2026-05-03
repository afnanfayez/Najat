import { z } from 'zod'

export const registerStepTwoSchema = z.object({
  gender: z.string().min(1, 'يرجى اختيار الجنس'),
  age: z.string().min(1, 'يرجى اختيار الفئة العمرية'),
  maritalStatus: z.string().min(1, 'يرجى اختيار الحالة الاجتماعية'),
  healthStatus: z.string().min(1, 'يرجى اختيار الحالة الصحية'),
  identityNumber: z
    .string()
    .trim()
    .min(1, 'يرجى إدخال رقم الهوية')
    .regex(/^\d{9}$/, 'رقم الهوية يجب أن يتكون من 9 أرقام بالضبط'),
})

export type RegisterStepTwoValues = z.infer<typeof registerStepTwoSchema>
