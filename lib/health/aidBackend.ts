import { aidAPI } from '@/lib/api/aid'
import { mapAidDtoToHumanitarianAid } from '@/lib/mappers/aid'
import type { HumanitarianAid } from '@/schemas/humanitarianAid'

const AID_PAGE_SIZE = 50
const MAX_PAGES = 10

export async function fetchAllAidPages(): Promise<HumanitarianAid[]> {
  const first = await aidAPI.list({ page: 1, limit: AID_PAGE_SIZE })
  const totalPages = Math.min(
    Math.ceil(first.meta.totalItems / AID_PAGE_SIZE),
    MAX_PAGES,
  )

  if (totalPages <= 1) return first.data.map(mapAidDtoToHumanitarianAid)

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) =>
      aidAPI.list({ page: i + 2, limit: AID_PAGE_SIZE }),
    ),
  )

  return [first, ...rest].flatMap((res) => res.data.map(mapAidDtoToHumanitarianAid))
}
