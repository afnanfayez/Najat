import { z } from 'zod'
import { paginationMetaSchema } from '@/schemas/hospitalApi'
import { bilingualMessageSchema } from '@/schemas/shared'

export const dentalDoctorSchema = z.object({
  name: z.string(),
  specialty: z.string(),
  workingDays: z.array(z.string()).optional(),
  workingHours: z.string().optional(),
})

export const dentalDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  contactNumber: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  distance: z.coerce.number().optional(),
  status: z.string().optional(),
  dentalChairs: z.number().optional(),
  implantsAvailable: z.boolean().optional().default(false),
  orthodonticsAvailable: z.boolean().optional().default(false),
  workingDoctors: z.array(dentalDoctorSchema).optional(),
  availableTests: z.array(z.object({
    name: z.string(),
    type: z.string(),
    resultTime: z.string(),
  })).optional(),
  currentMedications: z.array(z.object({
    name: z.string(),
    type: z.string(),
    status: z.string(),
  })).optional(),
  workingHours: z.string().optional(),
  workingDays: z.array(z.string()).optional(),
  medicalSupplies: z.array(z.string()).optional(),
  healthcareCategories: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type DentalDto = z.infer<typeof dentalDtoSchema>

export const dentalClinicsPaginatedResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number().optional(),
  message: bilingualMessageSchema.optional(),
  data: z.array(dentalDtoSchema),
  meta: paginationMetaSchema,
  timestamp: z.string().optional(),
})

export type DentalClinicsPaginatedResponse = z.infer<typeof dentalClinicsPaginatedResponseSchema>

export const dentalClinicsNearbyResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number().optional(),
  message: bilingualMessageSchema.optional(),
  data: z.array(dentalDtoSchema),
  meta: paginationMetaSchema.optional(),
  timestamp: z.string().optional(),
})

export type DentalClinicsNearbyResponse = z.infer<
  typeof dentalClinicsNearbyResponseSchema
>
