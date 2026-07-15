export function bilingual(ar: string, en: string): { ar: string; en: string } {
  return { ar, en }
}

export function nowIso(): string {
  return new Date().toISOString()
}

export interface PaginationMeta {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  syncTimestamp: string
}

export function paginateItems<T>(
  items: T[],
  page = 1,
  limit = 20,
): { pageItems: T[]; meta: PaginationMeta } {
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(1, limit)))
  const clampedPage = Math.min(Math.max(1, page), totalPages)
  const start = (clampedPage - 1) * limit
  const pageItems = items.slice(start, start + limit)
  return {
    pageItems,
    meta: {
      page: clampedPage,
      limit,
      totalItems,
      totalPages,
      hasNextPage: clampedPage < totalPages,
      hasPreviousPage: clampedPage > 1,
      syncTimestamp: nowIso(),
    },
  }
}

export function haversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
