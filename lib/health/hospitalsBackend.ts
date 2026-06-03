import { hospitalsAPI } from '@/lib/api/hospitals'
import { mapHospitalDtoToFacility } from '@/lib/mappers/hospital'
import type { HealthFacility } from '@/schemas/healthFacility'

const HOSPITAL_LIST_PAGE_SIZE = 50
const MAX_HOSPITAL_PAGES = 25

export async function fetchAllHospitalPages(): Promise<HealthFacility[]> {
  const all: HealthFacility[] = []
  let page = 1
  while (page <= MAX_HOSPITAL_PAGES) {
    const res = await hospitalsAPI.list({
      page,
      limit: HOSPITAL_LIST_PAGE_SIZE,
    })
    all.push(...res.data.map(mapHospitalDtoToFacility))
    if (!res.meta?.hasNextPage) break
    page += 1
  }
  return all
}
