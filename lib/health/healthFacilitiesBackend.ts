import { pharmaciesAPI } from '@/lib/api/pharmacies'
import { labsAPI } from '@/lib/api/labs'
import { clinicsAPI } from '@/lib/api/clinics'
import { dentalClinicsAPI } from '@/lib/api/dentalClinics'
import { mapPharmacyDtoToFacility } from '@/lib/mappers/pharmacy'
import { mapLabDtoToFacility } from '@/lib/mappers/lab'
import { mapClinicDtoToFacility } from '@/lib/mappers/clinic'
import { mapDentalDtoToFacility } from '@/lib/mappers/dentalClinic'
import { fetchPagesWithConcurrency } from '@/lib/utils/fetchPagesWithConcurrency'
import type { FacilityCategory, HealthFacility } from '@/schemas/healthFacility'

const PAGE_SIZE = 50
const MAX_PAGES = 20
const PAGE_CONCURRENCY = 3
const CATEGORY_BATCH_SIZE = 2

async function fetchAllPages<T>(
  fetchPage: (
    page: number,
  ) => Promise<{ data: T[]; meta: { hasNextPage?: boolean; totalPages?: number } }>,
): Promise<T[]> {
  const first = await fetchPage(1)

  if (typeof first.meta.totalPages !== 'number') {
    const all = [...first.data]
    let page = 2
    while (first.meta?.hasNextPage && page <= MAX_PAGES) {
      const res = await fetchPage(page)
      all.push(...res.data)
      if (!res.meta?.hasNextPage) break
      page += 1
    }
    return all
  }

  const totalPages = Math.min(first.meta.totalPages, MAX_PAGES)

  if (totalPages <= 1) return first.data

  const rest = await fetchPagesWithConcurrency(totalPages, PAGE_CONCURRENCY, fetchPage)

  return [first, ...rest].flatMap((res) => res.data)
}

// Runs tasks in fixed-size sequential batches so independent categories don't
// all fan out their page requests to the backend at the same time.
async function runInBatches<T>(
  tasks: Array<() => Promise<T>>,
  batchSize: number,
): Promise<T[]> {
  const results: T[] = []
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize)
    results.push(...(await Promise.all(batch.map((task) => task()))))
  }
  return results
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

  // No specific category — fetch all non-hospital types, two categories at a
  // time, so we don't fan out all four categories' page requests at once.
  const [pharmacies, labs, clinics, dental] = await runInBatches(
    [
      () =>
        fetchAllPages((p) => pharmaciesAPI.list({ page: p, limit: PAGE_SIZE })).then(
          (dtos) => dtos.map(mapPharmacyDtoToFacility),
        ),
      () =>
        fetchAllPages((p) => labsAPI.list({ page: p, limit: PAGE_SIZE })).then((dtos) =>
          dtos.map(mapLabDtoToFacility),
        ),
      () =>
        fetchAllPages((p) => clinicsAPI.list({ page: p, limit: PAGE_SIZE })).then(
          (dtos) => dtos.map(mapClinicDtoToFacility),
        ),
      () =>
        fetchAllPages((p) => dentalClinicsAPI.list({ page: p, limit: PAGE_SIZE })).then(
          (dtos) => dtos.map(mapDentalDtoToFacility),
        ),
    ],
    CATEGORY_BATCH_SIZE,
  )

  const facilities = [...pharmacies, ...labs, ...clinics, ...dental]
  return { facilities, total: facilities.length }
}
