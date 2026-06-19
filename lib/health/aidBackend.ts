import { aidAPI } from '@/lib/api/aid'
import { mapAidDtoToHumanitarianAid } from '@/lib/mappers/aid'
import { fetchPagesWithConcurrency } from '@/lib/utils/fetchPagesWithConcurrency'
import type { HumanitarianAid } from '@/schemas/humanitarianAid'

const AID_PAGE_SIZE = 50
const MAX_PAGES = 10
const AID_PAGE_CONCURRENCY = 3

export async function fetchAllAidPages(): Promise<HumanitarianAid[]> {
  const first = await aidAPI.list({ page: 1, limit: AID_PAGE_SIZE })
  const totalPages = Math.min(
    Math.ceil(first.meta.totalItems / AID_PAGE_SIZE),
    MAX_PAGES,
  )

  if (totalPages <= 1) return first.data.map(mapAidDtoToHumanitarianAid)

  const rest = await fetchPagesWithConcurrency(totalPages, AID_PAGE_CONCURRENCY, (page) =>
    aidAPI.list({ page, limit: AID_PAGE_SIZE }),
  )

  return [first, ...rest].flatMap((res) => res.data.map(mapAidDtoToHumanitarianAid))
}
