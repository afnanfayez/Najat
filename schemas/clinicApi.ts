import { z } from 'zod'
import { paginationMetaSchema } from '@/schemas/hospitalApi'

export const clinicDoctorSchema = z.object({
  name: z.string(),
  specialty: z.string(),
  workingDays: z.array(z.string()).optional(),
  workingHours: z.string().optional(),
})

export const clinicDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  contactNumber: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  distance: z.coerce.number().optional(),
  specialties: z.array(z.string()).optional(),
  practitionersCount: z.number().optional(),
  workingDoctors: z.array(clinicDoctorSchema).optional(),
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

export type ClinicDto = z.infer<typeof clinicDtoSchema>

export const clinicsNearbyResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number().optional(),
  message: z.string().optional(),
  data: z.array(clinicDtoSchema),
  meta: paginationMetaSchema.optional(),
  timestamp: z.string().optional(),
})

export type ClinicsNearbyResponse = z.infer<typeof clinicsNearbyResponseSchema>
