import type { HumanitarianAid } from '@/schemas/humanitarianAid'
import type { AidDto } from '@/schemas/aidApi'

function mapStockStatus(raw?: string | null): HumanitarianAid['status'] {
  if (!raw) return 'active'
  const s = raw.toLowerCase()
  if (s.includes('low') || s === 'limited') return 'limited'
  if (s.includes('empty') || s.includes('out') || s === 'stopped') return 'stopped'
  return 'active'
}

const CATEGORY_KEYWORDS: Array<{ category: HumanitarianAid['category']; keywords: string[] }> = [
  { category: 'water',   keywords: ['مياه', 'ماء', 'water', 'wash', 'تعقيم', 'صرف'] },
  { category: 'food',    keywords: ['غذاء', 'طعام', 'food', 'وجبة', 'دقيق', 'زيت', 'سكر', 'معلبات', 'طرود'] },
  { category: 'health',  keywords: ['دواء', 'صحة', 'medicine', 'health', 'medical', 'جراحة', 'لقاح', 'مستلزمات طبية'] },
  { category: 'shelter', keywords: ['خيام', 'خيمة', 'shelter', 'مأوى', 'إيواء', 'بطانيات', 'مراتب'] },
  { category: 'clothes', keywords: ['ملابس', 'أغطية', 'clothes', 'clothing', 'أحذية', 'كسوة'] },
]

function inferCategory(supplies: string[]): HumanitarianAid['category'] {
  const haystack = supplies.join(' ').toLowerCase()
  for (const { category, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((kw) => haystack.includes(kw))) return category
  }
  return 'all'
}

export function mapAidDtoToHumanitarianAid(dto: AidDto): HumanitarianAid {
  const supplies = dto.availableSupplies ?? []
  const description =
    supplies.length > 0
      ? `يوفر: ${supplies.join('، ')}`
      : 'نقطة توزيع مساعدات إنسانية'

  return {
    id: dto.id,
    name: dto.name,
    provider: dto.address ?? dto.name,
    description,
    status: mapStockStatus(dto.stockStatus),
    tags: supplies.slice(0, 4),
    category: inferCategory(supplies),
  }
}
