import { z } from 'zod'
import { paginationMetaSchema } from '@/schemas/hospitalApi'
import { bilingualMessageSchema } from '@/schemas/shared'

export const pharmacyMedicationSchema = z.object({
  name: z.string(),
  type: z.string(),
  status: z.string(),
})

export const pharmacyDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  contactNumber: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  is24Hours: z.boolean().optional().default(false),
  deliveryAvailable: z.boolean().optional().default(false),
  deliveryRadius: z.number().optional().nullable(),
  currentMedications: z.array(pharmacyMedicationSchema).optional(),
  workingHours: z.string().optional(),
  workingDays: z.array(z.string()).optional(),
  medicalSupplies: z.array(z.string()).optional(),
  healthcareCategories: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type PharmacyDto = z.infer<typeof pharmacyDtoSchema>

export const nearbyPharmacyDtoSchema = pharmacyDtoSchema.extend({
  distance: z.coerce.number(),
})

export type NearbyPharmacyDto = z.infer<typeof nearbyPharmacyDtoSchema>

export const pharmaciesPaginatedResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number().optional(),
  message: bilingualMessageSchema.optional(),
  data: z.array(pharmacyDtoSchema),
  meta: paginationMetaSchema,
  timestamp: z.string().optional(),
})

export type PharmaciesPaginatedResponse = z.infer<
  typeof pharmaciesPaginatedResponseSchema
>

export const pharmaciesNearbyPaginatedResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number().optional(),
  message: bilingualMessageSchema.optional(),
  data: z.array(nearbyPharmacyDtoSchema),
  meta: paginationMetaSchema,
  timestamp: z.string().optional(),
})

export type PharmaciesNearbyPaginatedResponse = z.infer<
  typeof pharmaciesNearbyPaginatedResponseSchema
>
