import { z } from 'zod'

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
})

export type UserProfile = z.infer<typeof userProfileSchema>

export const updateUserProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phoneNumber: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  ageGroup: z.enum(['18-40', 'above 40']).optional(),
  maritalStatus: z
    .enum(['single', 'married', 'divorced', 'widowed'])
    .optional(),
  healthStatus: z
    .enum(['Healthy', 'Chronically Ill', 'Injured', 'Amputee'])
    .optional(),
  nationalId: z.string().optional(),
  housingStatus: z.string().optional(),
  familyMembersCount: z.coerce.number().optional(),
  femalesCount: z.coerce.number().optional(),
  malesCount: z.coerce.number().optional(),
  region: z.string().optional(),
})

export type UpdateUserProfileBody = z.infer<typeof updateUserProfileSchema>
