import { aidAPI } from '@/lib/api/aid'
import { mapAidDtoToHumanitarianAid } from '@/lib/mappers/aid'
import type { HumanitarianAid } from '@/schemas/humanitarianAid'

const AID_PAGE_SIZE = 50
const MAX_PAGES = 10

export async function fetchAllAidPages(): Promise<HumanitarianAid[]> {
  const all: HumanitarianAid[] = []
  let page = 1
  while (page <= MAX_PAGES) {
    const res = await aidAPI.list({ page, limit: AID_PAGE_SIZE })
    all.push(...res.data.map(mapAidDtoToHumanitarianAid))
    if (page * AID_PAGE_SIZE >= res.meta.totalItems) break
    page += 1
  }
  return all
}
