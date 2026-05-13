import { request } from '@/lib/api/api'
import {
  clinicsNearbyResponseSchema,
  type ClinicsNearbyResponse,
} from '@/schemas/clinicApi'
import { GAZA_CENTER } from '@/lib/api/geoDefaults'

export const clinicsAPI = {
  async nearby(overrides?: {
    latitude?: number
    longitude?: number
    radius?: number
  }): Promise<ClinicsNearbyResponse> {
    const { latitude, longitude, radius } = { ...GAZA_CENTER, ...overrides }
    const qs = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      radius: String(radius),
    })
    const raw = await request(`/v1/clinics/nearby?${qs}`)
    return clinicsNearbyResponseSchema.parse(raw)
  },
}
