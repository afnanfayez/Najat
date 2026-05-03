import { z } from 'zod'

export const registerStepFourSchema = z
  .object({
    password: z
      .string()
      .min(8, 'يجب أن لا تقل كلمة المرور عن 8 أحرف')
      .regex(/\d/, 'يجب أن تحتوي كلمة المرور على أرقام')
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        'يجب أن تحتوي كلمة المرور على رموز خاصة'
      ),
    confirmPassword: z.string().min(1, 'يرجى تأكيد كلمة المرور'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  })

export type RegisterStepFourValues = z.infer<typeof registerStepFourSchema>
