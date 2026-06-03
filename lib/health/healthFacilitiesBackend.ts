import { pharmaciesAPI } from '@/lib/api/pharmacies'
import { labsAPI } from '@/lib/api/labs'
import { clinicsAPI } from '@/lib/api/clinics'
import { dentalClinicsAPI } from '@/lib/api/dentalClinics'
import { mapPharmacyDtoToFacility } from '@/lib/mappers/pharmacy'
import { mapLabDtoToFacility } from '@/lib/mappers/lab'
import { mapClinicDtoToFacility } from '@/lib/mappers/clinic'
import { mapDentalDtoToFacility } from '@/lib/mappers/dentalClinic'
import type { FacilityCategory, HealthFacility } from '@/schemas/healthFacility'

const PAGE_SIZE = 50
const MAX_PAGES = 20

async function fetchAllPages<T>(
  fetchPage: (
    page: number,
  ) => Promise<{ data: T[]; meta: { hasNextPage?: boolean } }>,
): Promise<T[]> {
  const all: T[] = []
  let page = 1
  while (page <= MAX_PAGES) {
    const res = await fetchPage(page)
    all.push(...res.data)
    if (!res.meta?.hasNextPage) break
    page += 1
  }
  return all
}

export async function fetchLiveNonHospitalFacilities(params?: {
  category?: FacilityCategory
}): Promise<{ facilities: HealthFacility[]; total: number }> {
  const category = params?.category

  if (category === 'pharmacies') {
    const dtos = await fetchAllPages((p) =>
      pharmaciesAPI.list({ page: p, limit: PAGE_SIZE }),
    )
    const facilities = dtos.map(mapPharmacyDtoToFacility)
    return { facilities, total: facilities.length }
  }

  if (category === 'labs') {
    const dtos = await fetchAllPages((p) =>
      labsAPI.list({ page: p, limit: PAGE_SIZE }),
    )
    const facilities = dtos.map(mapLabDtoToFacility)
    return { facilities, total: facilities.length }
  }

  if (category === 'clinics') {
    const dtos = await fetchAllPages((p) =>
      clinicsAPI.list({ page: p, limit: PAGE_SIZE }),
    )
    const facilities = dtos.map(mapClinicDtoToFacility)
    return { facilities, total: facilities.length }
  }

  if (category === 'dental') {
    const dtos = await fetchAllPages((p) =>
      dentalClinicsAPI.list({ page: p, limit: PAGE_SIZE }),
    )
    const facilities = dtos.map(mapDentalDtoToFacility)
    return { facilities, total: facilities.length }
  }

  // No specific category — fetch all non-hospital types in parallel
  const [pharmacies, labs, clinics, dental] = await Promise.all([
    fetchAllPages((p) => pharmaciesAPI.list({ page: p, limit: PAGE_SIZE })).then(
      (dtos) => dtos.map(mapPharmacyDtoToFacility),
    ),
    fetchAllPages((p) => labsAPI.list({ page: p, limit: PAGE_SIZE })).then(
      (dtos) => dtos.map(mapLabDtoToFacility),
    ),
    fetchAllPages((p) => clinicsAPI.list({ page: p, limit: PAGE_SIZE })).then(
      (dtos) => dtos.map(mapClinicDtoToFacility),
    ),
    fetchAllPages((p) => dentalClinicsAPI.list({ page: p, limit: PAGE_SIZE })).then(
      (dtos) => dtos.map(mapDentalDtoToFacility),
    ),
  ])

  const facilities = [...pharmacies, ...labs, ...clinics, ...dental]
  return { facilities, total: facilities.length }
}
