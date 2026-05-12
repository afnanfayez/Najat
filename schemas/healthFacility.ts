import { z } from 'zod'

import { hospitalCapacityStatusSchema } from '@/schemas/hospitalApi'
import type { HealthFacilityDetail } from '@/schemas/healthFacilityDetail'

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
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  capacityStatus: hospitalCapacityStatusSchema.optional(),
  distanceMeters: z.number().optional(),
  updatedAt: z.string().optional(),
  /** Set when mapped from `/api/v1/hospitals` */
  fromHospitalApi: z.boolean().optional(),
  /** فلترة "شمال / جنوب" — من الباكند أو من المِوك */
  region: z.enum(['north', 'south']).optional(),
  /** تفاصيل إضافية (أطباء، أدوية، خدمات، ساعات عمل، …) */
  detail: z.unknown().optional(),
})

export const healthFacilitiesResponseSchema = z.object({
  facilities: z.array(healthFacilitySchema),
  total: z.number(),
})

export type HealthFacility = Omit<
  z.infer<typeof healthFacilitySchema>,
  'detail'
> & {
  detail?: HealthFacilityDetail
}
export type HealthFacilitiesResponse = z.infer<typeof healthFacilitiesResponseSchema>
export type FacilityCategory = HealthFacility['category']

export const CATEGORY_LABELS: Record<FacilityCategory, string> = {
  hospitals:  'مستشفيات',
  pharmacies: 'صيدليات',
  clinics:    'مستوصفات',
  labs:       'مراكز تحاليل',
  dental:     'مراكز أسنان',
}
