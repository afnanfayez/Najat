import { z } from 'zod'

/** Backend hospital capacity enum */
export const hospitalCapacityStatusSchema = z.enum([
  'full',
  'available',
  'critical',
])

export type HospitalCapacityStatus = z.infer<
  typeof hospitalCapacityStatusSchema
>

export const hospitalDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: hospitalCapacityStatusSchema,
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  address: z.string(),
  contactNumber: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type HospitalDto = z.infer<typeof hospitalDtoSchema>

/** GET /hospitals/:id may return a bare DTO or an envelope with `data` (Nest-style). */
export function parseHospitalGetByIdResponse(raw: unknown): HospitalDto {
  const asRecord =
    raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null
  if (
    asRecord &&
    'data' in asRecord &&
    asRecord.data &&
    typeof asRecord.data === 'object'
  ) {
    return hospitalDtoSchema.parse(asRecord.data)
  }
  return hospitalDtoSchema.parse(raw)
}

export const nearbyHospitalDtoSchema = hospitalDtoSchema.extend({
  distance: z.coerce.number(),
})

export type NearbyHospitalDto = z.infer<typeof nearbyHospitalDtoSchema>

export const paginationMetaSchema = z.object({
  page: z.coerce.number(),
  limit: z.coerce.number(),
  totalItems: z.coerce.number(),
  totalPages: z.coerce.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  syncTimestamp: z.string().optional(),
})

export const hospitalsPaginatedResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  message: z.string().optional(),
  data: z.array(hospitalDtoSchema),
  meta: paginationMetaSchema,
  timestamp: z.string().optional(),
})

export type HospitalsPaginatedResponse = z.infer<
  typeof hospitalsPaginatedResponseSchema
>

export const hospitalsNearbyPaginatedResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  message: z.string().optional(),
  data: z.array(nearbyHospitalDtoSchema),
  meta: paginationMetaSchema,
  timestamp: z.string().optional(),
})

export type HospitalsNearbyPaginatedResponse = z.infer<
  typeof hospitalsNearbyPaginatedResponseSchema
>

/** Single-hospital PATCH may include admin-only fields */
export const hospitalEntitySchema = hospitalDtoSchema.extend({
  location: z.string().optional(),
  deletedAt: z.string().nullable().optional(),
  version: z.number().optional(),
})

export type HospitalEntity = z.infer<typeof hospitalEntitySchema>
