import { z } from 'zod'

export const registerStepThreeSchema = z.object({
  housingStatus: z.string().min(1, 'يرجى اختيار حالة السكن'),
  currentMembers: z
    .string()
    .min(1, 'يرجى إدخال عدد الأفراد')
    .refine((val) => {
      const n = parseInt(val)
      return !isNaN(n) && n >= 1
    }, 'يجب أن يكون عدد الأفراد 1 على الأقل'),
  femaleCount: z
    .string()
    .min(1, 'يرجى إدخال عدد الإناث')
    .refine((val) => {
      const n = parseInt(val)
      return !isNaN(n) && n >= 0
    }, 'يجب أن يكون العدد 0 أو أكثر'),
  maleCount: z
    .string()
    .min(1, 'يرجى إدخال عدد الذكور')
    .refine((val) => {
      const n = parseInt(val)
      return !isNaN(n) && n >= 0
    }, 'يجب أن يكون العدد 0 أو أكثر'),
  region: z.string().trim().min(1, 'يرجى تحديد المنطقة'),
})

export type RegisterStepThreeValues = z.infer<typeof registerStepThreeSchema>
