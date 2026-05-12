import { healthAPI } from '@/lib/api/health'
import type { FacilityCategory, HealthFacility } from '@/schemas/healthFacility'

export type LiveHealthFacilitiesParams = {
  category?: FacilityCategory
  search?: string
}

/**
 * جلب من `/v1/health/facilities` (صيدليات، مختبرات، مستوصفات، أسنان، …).
 * المستشفيات تستخدم `hospitalsBackend` وليس هذا المسار.
 */
export async function fetchLiveNonHospitalFacilities(
  params?: LiveHealthFacilitiesParams,
): Promise<{ facilities: HealthFacility[]; total: number }> {
  const response = await healthAPI.getFacilities(params)
  const facilities = response.facilities.map(
    (f) =>
      ({
        ...f,
        medicineAvailability: f.medicineAvailability ?? 5,
      }) as HealthFacility,
  )
  return {
    facilities,
    total: response.total,
  }
}
