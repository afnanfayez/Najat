import { z } from 'zod'
import { bilingualMessageSchema } from '@/schemas/shared'

/**
 * A string array column that may arrive as `null` from Postgres.
 *
 * `.optional()` accepts only `undefined` and `.default([])` only fills
 * `undefined` — neither tolerates an explicit JSON `null`. Because these DTOs
 * are parsed inside `z.array(...)`, one NULL column rejected the whole page of
 * results and blanked the entire aid list (see
 * supabase/migrations/0024_fix_null_aid_arrays.sql). Normalise null/undefined
 * to an empty array so bad data degrades one field instead of the whole list.
 */
const nullableStringArray = z
  .array(z.string())
  .nullish()
  .transform((value) => value ?? [])

/** Matches AidPointResponseDto / NearbyAidPointResponseDto in Najat OpenAPI */
export const aidPointStatusSchema = z.enum(['active', 'suspended', 'limited'])

export const aidPointTypeSchema = z.enum([
  'all',
  'food',
  'water',
  'health',
  'shelter',
  'clothing_blankets',
  'organizations',
])

export const nearbyAidPointDtoSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    label: z.string().optional().nullable(),
    status: z.union([aidPointStatusSchema, z.string()]),
    availableSupplies: nullableStringArray,
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    type: z.union([aidPointTypeSchema, z.string()]).optional().nullable(),
    distance: z.coerce.number(),
  })
  .passthrough()

export const aidNearbyEnvelopeSchema = z
  .object({
    success: z.boolean(),
    statusCode: z.number().optional(),
    message: bilingualMessageSchema.optional(),
    data: z.array(nearbyAidPointDtoSchema),
    timestamp: z.string().optional(),
  })
  .passthrough()

export type NearbyAidPointDto = z.infer<typeof nearbyAidPointDtoSchema>

export const aidDtoSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    label: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
    type: z.string().optional().nullable(),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    availableSupplies: nullableStringArray,
    deletedAt: z.string().nullable().optional(),
    version: z.number().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  // `aid_points` also carries the admin "distribution point" extended
  // columns (region, manager, remaining, inventory, ...) folded in per
  // docs/BACKEND_API_SPEC.md §2 — passthrough so lib/api/adminAid.ts can
  // read them instead of always falling back to TODO placeholders.
  .passthrough()

export type AidDto = z.infer<typeof aidDtoSchema>

// Aid meta only returns totalItems + syncTimestamp (unlike other endpoints)
const aidMetaSchema = z.object({
  totalItems: z.coerce.number(),
  syncTimestamp: z.string().optional(),
})

export const aidsPaginatedResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number().optional(),
  message: bilingualMessageSchema.optional(),
  data: z.array(aidDtoSchema),
  meta: aidMetaSchema,
  timestamp: z.string().optional(),
})

export type AidsPaginatedResponse = z.infer<typeof aidsPaginatedResponseSchema>

export const aidByIdResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number().optional(),
  message: bilingualMessageSchema.optional(),
  data: aidDtoSchema,
  timestamp: z.string().optional(),
})

export const aidRequestDtoSchema = z.object({
  id: z.string(),
  aidPointId: z.string().optional(),
  userId: z.string().optional(),
  status: z
    .enum(['pending', 'in_progress', 'approved', 'rejected', 'fulfilled'])
    .catch('pending'),
  notes: z.string().optional().nullable(),
  requestedSupplies: z.array(z.string()).optional().default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  // Local-store fields (saved by /api/aid-requests POST)
  aidOrganizationId: z.string().optional(),
  aidOrganizationName: z.string().optional(),
  husbandName: z.string().optional(),
  wifeName: z.string().optional(),
  phoneNumber: z.string().optional(),
  currentLocation: z.string().optional(),
  femaleChildrenCount: z.number().optional(),
  maleChildrenCount: z.number().optional(),
}).passthrough()

export type AidRequestDto = z.infer<typeof aidRequestDtoSchema>

export const aidRequestsPaginatedResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number().optional(),
  message: bilingualMessageSchema.optional(),
  data: z.array(aidRequestDtoSchema),
  meta: z.object({ totalItems: z.coerce.number() }).passthrough().optional(),
  timestamp: z.string().optional(),
}).passthrough()

export type AidRequestsPaginatedResponse = z.infer<typeof aidRequestsPaginatedResponseSchema>
