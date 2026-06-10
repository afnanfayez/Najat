import type { FacilityCategory, HealthFacility } from '@/schemas/healthFacility'

/** مسارات أمامية بمسمّيات قريبة من الـ API (مثل `/api/v1/dental-clinics`)، انظر [Najat API](https://graduation-project-api-production-8251.up.railway.app/api/docs). */
export const HEALTH_ROUTE: Record<FacilityCategory, string> = {
  hospitals: '/hospitals',
  pharmacies: '/pharmacies',
  clinics: '/clinics',
  labs: '/labs',
  dental: '/dental-clinics',
}

/** ترتيب ثابت حسب المعرّف — الرقم في المسار يطابق هذا الترتيب (1…n). */
export function sortHealthFacilitiesStable(
  facilities: HealthFacility[],
): HealthFacility[] {
  return [...facilities].sort((a, b) =>
    String(a.id).localeCompare(String(b.id), undefined, { numeric: true }),
  )
}

/** رقم ترتيبي في المسار فقط: `/hospitals/3` وليس UUID. */
export function parseOrdinalRouteParam(param: string): number | null {
  if (!/^[1-9]\d*$/.test(param)) return null
  return Number(param)
}

export function healthFacilityOrdinalPath(
  category: FacilityCategory,
  ordinal: number,
): string {
  return `${HEALTH_ROUTE[category]}/${ordinal}`
}

export function resolveFacilityByOrdinal(
  facilities: HealthFacility[] | undefined,
  ordinal: number,
): HealthFacility | null {
  if (!facilities?.length || ordinal < 1) return null
  const sorted = sortHealthFacilitiesStable(facilities)
  return sorted[ordinal - 1] ?? null
}

export const HUMANITARIAN_AID_LIST_PATH = '/humanitarian-aid'

export function sortAidByStableId<T extends { id: string }>(items: T[]): T[] {
  return [...items].sort((a, b) =>
    String(a.id).localeCompare(String(b.id), undefined, { numeric: true }),
  )
}

export function humanitarianAidOrdinalPath(ordinal: number): string {
  return `${HUMANITARIAN_AID_LIST_PATH}/${ordinal}`
}

export function resolveAidByOrdinal<T extends { id: string }>(
  items: T[] | undefined,
  ordinal: number,
): T | null {
  if (!items?.length || ordinal < 1) return null
  const sorted = sortAidByStableId(items)
  return sorted[ordinal - 1] ?? null
}

const ENTRIES: [string, FacilityCategory][] = [
  ['/hospitals', 'hospitals'],
  ['/pharmacies', 'pharmacies'],
  ['/clinics', 'clinics'],
  ['/labs', 'labs'],
  ['/dental-clinics', 'dental'],
]

export const HEALTH_PATH_TO_CATEGORY: Record<string, FacilityCategory> =
  Object.fromEntries(ENTRIES)

export function healthCategoryFromPathname(pathname: string): FacilityCategory | null {
  for (const [prefix, cat] of ENTRIES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return cat
  }
  return null
}

export function isHealthFacilityPath(pathname: string): boolean {
  return healthCategoryFromPathname(pathname) != null
}
