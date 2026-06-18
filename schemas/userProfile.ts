import { z } from 'zod'

export const assistancePreferencesSchema = z.object({
  food: z.boolean().default(false),
  medicine: z.boolean().default(false),
  water: z.boolean().default(false),
  clothes: z.boolean().default(false),
  health: z.boolean().default(false),
  transport: z.boolean().default(false),
})

export type AssistancePreferences = z.infer<typeof assistancePreferencesSchema>

export const userProfileSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string(),
  role: z.enum(['resident', 'volunteer', 'admin']),
  phoneNumber: z.string().nullable().optional(),
  gender: z.enum(['male', 'female']).nullable().optional(),
  ageGroup: z.enum(['18-40', 'above 40']).nullable().optional(),
  maritalStatus: z
    .enum(['single', 'married', 'divorced', 'widowed'])
    .nullable()
    .optional(),
  healthStatus: z
    .enum(['Healthy', 'Chronically Ill', 'Injured', 'Amputee'])
    .nullable()
    .optional(),
  nationalId: z.string().nullable().optional(),
  housingStatus: z.string().nullable().optional(),
  familyMembersCount: z.coerce.number().nullable().optional(),
  femalesCount: z.coerce.number().nullable().optional(),
  malesCount: z.coerce.number().nullable().optional(),
  region: z.string().nullable().optional(),
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  avatarUrl: z.string().nullable().optional(),
  assistancePreferences: assistancePreferencesSchema.nullable().optional(),
  assistanceLocation: z.string().nullable().optional(),
  assistanceRadius: z.coerce.number().nullable().optional(),
  emergencyContacts: z.array(z.any()).nullable().optional(),
  sosMessage: z.string().nullable().optional(),
  bloodType: z.string().nullable().optional(),
})

export type UserProfile = z.infer<typeof userProfileSchema>

// Patterns mirror the backend's own validation so invalid input is caught
// client-side (online AND offline) instead of failing later at the API.
// phoneNumber: international "+" + 8–15 digits, or local "0" + 10 digits.
// nationalId: exactly 9 digits.
const PHONE_PATTERN = /^(\+\d{8,15}|0\d{9})$/
const NATIONAL_ID_PATTERN = /^\d{9}$/

export const updateUserProfileSchema = z.object({
  fullName: z.string().min(2, 'الاسم قصير جداً').optional(),
  phoneNumber: z
    .string()
    .regex(PHONE_PATTERN, 'رقم الهاتف غير صحيح، استخدم صيغة مثل +970592990002 أو 0592990002')
    .optional(),
  gender: z.enum(['male', 'female']).optional(),
  ageGroup: z.enum(['18-40', 'above 40']).optional(),
  maritalStatus: z
    .enum(['single', 'married', 'divorced', 'widowed'])
    .optional(),
  healthStatus: z
    .enum(['Healthy', 'Chronically Ill', 'Injured', 'Amputee'])
    .optional(),
  nationalId: z
    .string()
    .regex(NATIONAL_ID_PATTERN, 'رقم الهوية يجب أن يتكوّن من 9 أرقام')
    .optional(),
  housingStatus: z.string().optional(),
  familyMembersCount: z.coerce.number().optional(),
  femalesCount: z.coerce.number().optional(),
  malesCount: z.coerce.number().optional(),
  region: z.string().optional(),
  assistancePreferences: assistancePreferencesSchema.optional(),
  assistanceLocation: z.string().optional(),
  assistanceRadius: z.coerce.number().optional(),
})

export type UpdateUserProfileBody = z.infer<typeof updateUserProfileSchema>

/**
 * Validate the backend-bound profile fields before sending/queueing.
 * Returns an Arabic error message, or null when the body is valid.
 */
export function validateProfileUpdate(body: Record<string, unknown>): string | null {
  const result = updateUserProfileSchema.safeParse(body)
  if (result.success) return null
  return result.error.issues[0]?.message ?? 'بيانات غير صالحة'
}
