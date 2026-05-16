import { z } from 'zod'
import { bilingualMessageSchema } from '@/schemas/shared'

export const hospitalDoctorSchema = z.object({
  name: z.string(),
  specialty: z.string(),
  workingDays: z.array(z.string()).optional(),
  workingHours: z.string().optional(),
})

/** Backend hospital capacity enum */
export const hospitalCapacityStatusSchema = z.enum([
  'full',
  'available',
  'critical',
  'closed',
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
  icuCapacity: z.number().optional().nullable(),
  totalBeds: z.number().optional().nullable(),
  emergencyLevel: z.enum(['level_1', 'level_2', 'level_3']).optional().nullable(),
  workingDoctors: z.array(hospitalDoctorSchema).optional(),
  workingHours: z.string().optional().nullable(),
  workingDays: z.array(z.string()).optional(),
  currentMedications: z.array(z.unknown()).optional(),
  medicalSupplies: z.array(z.string()).optional(),
  healthcareCategories: z.array(z.string()).optional(),
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
  message: bilingualMessageSchema.optional(),
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
  message: bilingualMessageSchema.optional(),
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
