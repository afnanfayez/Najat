/** Server-side port of lib/mocks/crud/paginationHelpers.ts against Postgres. */

export interface PaginationMeta {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  syncTimestamp: string
}

export function parsePagination(searchParams: URLSearchParams, defaultLimit = 20) {
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
  const limit = Math.max(1, Number(searchParams.get('limit') ?? String(defaultLimit)) || defaultLimit)
  const from = (page - 1) * limit
  const to = from + limit - 1
  return { page, limit, from, to }
}

export function buildMeta(page: number, limit: number, totalItems: number): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(1, limit)))
  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    syncTimestamp: new Date().toISOString(),
  }
}
