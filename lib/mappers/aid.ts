import type { HumanitarianAid } from '@/schemas/humanitarianAid'
import type { AidDto } from '@/schemas/aidApi'

function mapStatus(raw?: string | null): HumanitarianAid['status'] {
  if (!raw) return 'active'
  const s = raw.toLowerCase()
  if (s === 'limited' || s.includes('low')) return 'limited'
  if (s === 'suspended' || s === 'stopped' || s.includes('out') || s.includes('empty')) return 'stopped'
  return 'active'
}

const CATEGORY_KEYWORDS: Array<{ category: HumanitarianAid['category']; keywords: string[] }> = [
  { category: 'water',   keywords: ['مياه', 'ماء', 'water', 'wash', 'تعقيم', 'صرف', 'jerrycan'] },
  { category: 'food',    keywords: ['غذاء', 'طعام', 'food', 'وجبة', 'دقيق', 'زيت', 'سكر', 'معلبات', 'طرود', 'meal', 'kitchen', 'cooking'] },
  { category: 'health',  keywords: ['دواء', 'صحة', 'medicine', 'health', 'medical', 'جراحة', 'لقاح', 'مستلزمات طبية'] },
  { category: 'shelter', keywords: ['خيام', 'خيمة', 'shelter', 'مأوى', 'إيواء', 'بطانيات', 'مراتب', 'tent'] },
  { category: 'clothes', keywords: ['ملابس', 'أغطية', 'clothes', 'clothing', 'أحذية', 'كسوة'] },
]

const TYPE_TO_CATEGORY: Record<string, HumanitarianAid['category']> = {
  food: 'food',
  water: 'water',
  health: 'health',
  shelter: 'shelter',
  clothes: 'clothes',
  clothing_blankets: 'clothes',
  organizations: 'all',
  all: 'all',
}

function inferCategory(type?: string | null, supplies?: string[]): HumanitarianAid['category'] {
  if (type) {
    const key = type.toLowerCase().replace(/-/g, '_')
    const mapped = TYPE_TO_CATEGORY[key]
    if (mapped) return mapped
  }
  const haystack = (supplies ?? []).join(' ').toLowerCase()
  for (const { category, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((kw) => haystack.includes(kw))) return category
  }
  return 'all'
}

function inferRegions(name: string): string[] {
  const regions: string[] = []
  if (!name) return ['الشمال', 'الجنوب']
  
  const n = name.toLowerCase()

  if (n.includes('شمال') || n.includes('غزة') || n.includes('جباليا') || n.includes('حانون') || n.includes('رمال') || n.includes('شجاعية')) {
    regions.push('الشمال')
  }

  if (n.includes('جنوب') || n.includes('وسطى') || n.includes('نصيرات') || n.includes('دير البلح') || n.includes('خانيونس') || n.includes('رفح') || n.includes('مغازي') || n.includes('بريج') || n.includes('مواصي')) {
    regions.push('الجنوب')
  }

  if (regions.length === 0) {

    return ['الشمال', 'الجنوب']
  }
  return regions
}

export function mapAidDtoToHumanitarianAid(dto: AidDto): HumanitarianAid {
  const supplies = dto.availableSupplies ?? []
  const description =
    supplies.length > 0
      ? `يوفر: ${supplies.join('، ')}`
      : 'نقطة توزيع مساعدات إنسانية'
      
  const combinedName = `${dto.name} ${dto.label ?? ''}`

  return {
    id: dto.id,
    name: dto.label ?? dto.name,
    provider: dto.name,
    description,
    status: mapStatus(dto.status),
    tags: supplies.slice(0, 4),
    category: inferCategory(dto.type, supplies),
    regions: inferRegions(combinedName),
  }
}
