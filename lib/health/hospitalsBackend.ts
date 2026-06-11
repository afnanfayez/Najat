import { hospitalsAPI } from '@/lib/api/hospitals'
import { mapHospitalDtoToFacility } from '@/lib/mappers/hospital'
import type { HealthFacility } from '@/schemas/healthFacility'

const HOSPITAL_LIST_PAGE_SIZE = 50
const MAX_HOSPITAL_PAGES = 25

export async function fetchAllHospitalPages(): Promise<HealthFacility[]> {
  const first = await hospitalsAPI.list({
    page: 1,
    limit: HOSPITAL_LIST_PAGE_SIZE,
  })
  const totalPages = Math.min(first.meta.totalPages ?? 1, MAX_HOSPITAL_PAGES)

  if (totalPages <= 1) return first.data.map(mapHospitalDtoToFacility)

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) =>
      hospitalsAPI.list({
        page: i + 2,
        limit: HOSPITAL_LIST_PAGE_SIZE,
      }),
    ),
  )

  return [first, ...rest].flatMap((res) => res.data.map(mapHospitalDtoToFacility))
}
