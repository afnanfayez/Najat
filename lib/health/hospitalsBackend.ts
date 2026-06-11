import { hospitalsAPI } from '@/lib/api/hospitals'
import { mapHospitalDtoToFacility } from '@/lib/mappers/hospital'
import type { HealthFacility } from '@/schemas/healthFacility'

const HOSPITAL_LIST_PAGE_SIZE = 50
const MAX_HOSPITAL_PAGES = 25
const HOSPITAL_PAGE_CONCURRENCY = 3

async function fetchHospitalPage(page: number) {
  return hospitalsAPI.list({
    page,
    limit: HOSPITAL_LIST_PAGE_SIZE,
  })
}

async function fetchRemainingPages(totalPages: number) {
  const results = []

  for (let page = 2; page <= totalPages; page += HOSPITAL_PAGE_CONCURRENCY) {
    const pages = Array.from(
      { length: Math.min(HOSPITAL_PAGE_CONCURRENCY, totalPages - page + 1) },
      (_, i) => fetchHospitalPage(page + i),
    )
    const settled = await Promise.allSettled(pages)
    for (const result of settled) {
      if (result.status === 'fulfilled') {
        results.push(result.value)
      }
    }
  }

  return results
}

export async function fetchAllHospitalPages(): Promise<HealthFacility[]> {
  const first = await fetchHospitalPage(1)
  const totalPages = Math.min(first.meta.totalPages ?? 1, MAX_HOSPITAL_PAGES)

  if (totalPages <= 1) return first.data.map(mapHospitalDtoToFacility)

  const rest = await fetchRemainingPages(totalPages)

  return [first, ...rest].flatMap((res) => res.data.map(mapHospitalDtoToFacility))
}
