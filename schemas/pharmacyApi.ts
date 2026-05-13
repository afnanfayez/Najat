import { z } from 'zod'
import { paginationMetaSchema } from '@/schemas/hospitalApi'

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

export const pharmaciesPaginatedResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number().optional(),
  message: z.string().optional(),
  data: z.array(pharmacyDtoSchema),
  meta: paginationMetaSchema,
  timestamp: z.string().optional(),
})

export type PharmaciesPaginatedResponse = z.infer<
  typeof pharmaciesPaginatedResponseSchema
>
