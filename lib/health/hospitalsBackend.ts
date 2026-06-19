import { hospitalsAPI } from '@/lib/api/hospitals'
import { mapHospitalDtoToFacility } from '@/lib/mappers/hospital'
import { fetchPagesWithConcurrency } from '@/lib/utils/fetchPagesWithConcurrency'
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

export async function fetchAllHospitalPages(): Promise<HealthFacility[]> {
  const first = await fetchHospitalPage(1)
  const totalPages = Math.min(first.meta.totalPages ?? 1, MAX_HOSPITAL_PAGES)

  if (totalPages <= 1) return first.data.map(mapHospitalDtoToFacility)

  const rest = await fetchPagesWithConcurrency(
    totalPages,
    HOSPITAL_PAGE_CONCURRENCY,
    fetchHospitalPage,
  )

  return [first, ...rest].flatMap((res) => res.data.map(mapHospitalDtoToFacility))
}
