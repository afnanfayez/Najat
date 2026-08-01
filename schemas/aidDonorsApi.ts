import { z } from 'zod'
import { bilingualMessageSchema } from '@/schemas/shared'

/** Matches the `aid_donors` table (supabase/migrations/0005_aid.sql) 1:1 — no case-shape gap
 * with AdminAidDonorDetail (schemas/adminAid.ts), so no per-field mapping layer is needed. */
export const aidDonorDtoSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    subtitle: z.string().optional().nullable(),
    totalAmount: z.coerce.number().optional().nullable(),
    lastDonation: z.string().optional().nullable(),
    donorType: z.enum(['international', 'local', 'individual', 'strategic']),
    sector: z.string().optional().nullable(),
    contactPerson: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    website: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    partnershipStatus: z.enum(['active', 'renewal', 'ended']),
    agreementStart: z.string().optional().nullable(),
    agreementEnd: z.string().optional().nullable(),
    // `.nullish()`, not `.optional()`: focus_areas is a nullable text[] and a
    // JSON null would otherwise reject this DTO — and with it every donor in
    // the list. Same failure mode as availableSupplies in schemas/aidApi.ts.
    focusAreas: z
      .array(z.string())
      .nullish()
      .transform((value) => value ?? []),
    notes: z.string().optional().nullable(),
    active: z.boolean(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .passthrough()

export type AidDonorDto = z.infer<typeof aidDonorDtoSchema>

export const aidDonorByIdResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number().optional(),
  message: bilingualMessageSchema.optional(),
  data: aidDonorDtoSchema,
  timestamp: z.string().optional(),
})

export const aidDonorsPaginatedResponseSchema = z
  .object({
    success: z.boolean(),
    statusCode: z.number().optional(),
    message: bilingualMessageSchema.optional(),
    data: z.array(aidDonorDtoSchema),
    meta: z.object({ totalItems: z.coerce.number() }).passthrough().optional(),
    timestamp: z.string().optional(),
  })
  .passthrough()

export type AidDonorsPaginatedResponse = z.infer<typeof aidDonorsPaginatedResponseSchema>
