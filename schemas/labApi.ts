import { z } from 'zod'
import { paginationMetaSchema } from '@/schemas/hospitalApi'

export const labTestSchema = z.object({
  name: z.string(),
  type: z.string(),
  resultTime: z.string(),
})

export const labDoctorSchema = z.object({
  name: z.string(),
  specialty: z.string(),
  workingDays: z.array(z.string()).optional(),
  workingHours: z.string().optional(),
})

export const labMedicationSchema = z.object({
  name: z.string(),
  type: z.string(),
  status: z.string(),
})

export const labDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  contactNumber: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  availableTests: z.array(labTestSchema).optional(),
  homeCollection: z.boolean().optional().default(false),
  isoCertified: z.boolean().optional().default(false),
  workingDoctors: z.array(labDoctorSchema).optional(),
  currentMedications: z.array(labMedicationSchema).optional(),
  workingHours: z.string().optional(),
  workingDays: z.array(z.string()).optional(),
  medicalSupplies: z.array(z.string()).optional(),
  healthcareCategories: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type LabDto = z.infer<typeof labDtoSchema>

export const labsPaginatedResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number().optional(),
  message: z.string().optional(),
  data: z.array(labDtoSchema),
  meta: paginationMetaSchema,
  timestamp: z.string().optional(),
})

export type LabsPaginatedResponse = z.infer<typeof labsPaginatedResponseSchema>
