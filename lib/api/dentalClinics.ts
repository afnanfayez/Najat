import { request } from '@/lib/api/api'
import {
  dentalClinicsNearbyResponseSchema,
  type DentalClinicsNearbyResponse,
} from '@/schemas/dentalApi'
import { GAZA_CENTER } from '@/lib/api/geoDefaults'

export const dentalClinicsAPI = {
  async nearby(overrides?: {
    latitude?: number
    longitude?: number
    radius?: number
  }): Promise<DentalClinicsNearbyResponse> {
    const { latitude, longitude, radius } = { ...GAZA_CENTER, ...overrides }
    const qs = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      radius: String(radius),
    })
    const raw = await request(`/v1/dental-clinics/nearby?${qs}`)
    return dentalClinicsNearbyResponseSchema.parse(raw)
  },
}
