import { request, unwrapPaginated } from '@/lib/api/api'
import {
  parseArticleGetByIdResponse,
  parseArticlesListResponse,
  type ArticleCategory,
  type ArticleResponseDto,
  type ArticlesListResponse,
} from '@/schemas/articleApi'

const V1_ROOT =
  process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'

const ARTICLE_LIST_PAGE_SIZE = 50
const MAX_ARTICLE_PAGES = 25

export type ListArticlesParams = {
  page?: number
  limit?: number
  since?: string
  /** Documented in OpenAPI but not supported by the current production API. */
  category?: ArticleCategory
}

function buildArticlesQuery(params?: ListArticlesParams): string {
  const qs = new URLSearchParams()
  if (params?.page != null) qs.set('page', String(params.page))
  if (params?.limit != null) qs.set('limit', String(params.limit))
  if (params?.since) qs.set('since', params.since)
  // NOTE: Do NOT send `category` — production backend returns 400:
  // "'category' is not a recognized parameter." Filter client-side instead.
  const q = qs.toString()
  return q ? `?${q}` : ''
}

export const articlesAPI = {
  list(params?: ListArticlesParams): Promise<ArticlesListResponse> {
    const suffix = `${V1_ROOT}/articles${buildArticlesQuery(params)}`
    return request(suffix).then((raw) =>
      parseArticlesListResponse(unwrapPaginated(raw)),
    )
  },

  getById(id: string): Promise<ArticleResponseDto> {
    return request(`${V1_ROOT}/articles/${encodeURIComponent(id)}`).then(
      parseArticleGetByIdResponse,
    )
  },
}

export async function fetchAllArticlePages(): Promise<ArticleResponseDto[]> {
  const all: ArticleResponseDto[] = []
  let page = 1

  while (page <= MAX_ARTICLE_PAGES) {
    const res = await articlesAPI.list({
      page,
      limit: ARTICLE_LIST_PAGE_SIZE,
    })
    all.push(...res.data)

    if (res.data.length === 0) break

    const totalItems = res.meta?.totalItems
    if (typeof totalItems === 'number' && all.length >= totalItems) break

    // Production meta omits hasNextPage; stop after the first page unless more items remain.
    if (!res.meta?.hasNextPage) break
    page += 1
  }

  return all.filter((a) => a.isActive)
}
