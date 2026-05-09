import { z } from 'zod'

export const healthFacilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  category: z.enum(['hospitals', 'pharmacies', 'clinics', 'labs', 'dental']),
  isOpen: z.boolean(),
  medicineAvailability: z.number().min(0).max(100).optional(),
  imageUrl: z.string().optional(),
  distance: z.string().optional(),
  phone: z.string().optional(),
})

export const healthFacilitiesResponseSchema = z.object({
  facilities: z.array(healthFacilitySchema),
  total: z.number(),
})

export type HealthFacility = z.infer<typeof healthFacilitySchema>
export type HealthFacilitiesResponse = z.infer<typeof healthFacilitiesResponseSchema>
export type FacilityCategory = HealthFacility['category']

export const CATEGORY_LABELS: Record<FacilityCategory, string> = {
  hospitals:  'مستشفيات',
  pharmacies: 'صيدليات',
  clinics:    'مستوصفات',
  labs:       'مراكز تحاليل',
  dental:     'مراكز أسنان',
}
