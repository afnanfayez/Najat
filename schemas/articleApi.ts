import { z } from 'zod'
import { paginationMetaSchema } from '@/schemas/hospitalApi'
import { bilingualMessageSchema } from '@/schemas/shared'

const API_CATEGORIES = ['first-aid', 'awareness', 'mental-health'] as const

export const articleCategorySchema = z.enum(API_CATEGORIES)

export type ArticleCategory = z.infer<typeof articleCategorySchema>

export const authorResponseDtoSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  role: z.string(),
})

export type AuthorResponseDto = z.infer<typeof authorResponseDtoSchema>

function normalizeCategory(value: unknown): ArticleCategory {
  if (typeof value !== 'string') return 'awareness'
  const normalized = value.trim().toLowerCase().replace(/_/g, '-')
  if (normalized === 'mental' || normalized === 'mentalhealth') {
    return 'mental-health'
  }
  if (normalized === 'firstaid') return 'first-aid'
  if ((API_CATEGORIES as readonly string[]).includes(normalized)) {
    return normalized as ArticleCategory
  }
  return 'awareness'
}

function normalizeAuthor(value: unknown): AuthorResponseDto | null {
  if (!value || typeof value !== 'object') return null
  const a = value as Record<string, unknown>
  const id = a.id
  const fullName = a.fullName ?? a.full_name ?? a.name
  const role = a.role
  if (typeof id !== 'string' || typeof fullName !== 'string') return null
  return {
    id,
    fullName,
    role: typeof role === 'string' ? role : 'volunteer',
  }
}

function normalizeArticleRecord(raw: unknown): unknown {
  if (!raw || typeof raw !== 'object') return raw
  const r = raw as Record<string, unknown>
  return {
    ...r,
    id: r.id,
    titleAr: r.titleAr ?? r.title_ar ?? r.title,
    titleEn: r.titleEn ?? r.title_en,
    contentAr: r.contentAr ?? r.content_ar ?? r.content,
    contentEn: r.contentEn ?? r.content_en,
    category: normalizeCategory(r.category),
    image: r.image ?? r.imageUrl ?? r.image_url ?? null,
    readTime: r.readTime ?? r.read_time ?? 5,
    viewsCount: r.viewsCount ?? r.views_count ?? 0,
    isActive: r.isActive ?? r.is_active ?? true,
    author: normalizeAuthor(r.author),
    createdAt: r.createdAt ?? r.created_at ?? new Date(0).toISOString(),
    updatedAt: r.updatedAt ?? r.updated_at ?? new Date(0).toISOString(),
  }
}

export const articleResponseDtoSchema = z.preprocess(
  normalizeArticleRecord,
  z.object({
    id: z.string(),
    titleAr: z.string(),
    titleEn: z.string().optional().nullable(),
    contentAr: z.string(),
    contentEn: z.string().optional().nullable(),
    category: articleCategorySchema,
    image: z.string().optional().nullable(),
    readTime: z.coerce.number(),
    viewsCount: z.coerce.number(),
    isActive: z.coerce.boolean(),
    author: authorResponseDtoSchema.optional().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
)

export type ArticleResponseDto = z.infer<typeof articleResponseDtoSchema>

export const articlesListResponseSchema = z.object({
  success: z.boolean().optional(),
  statusCode: z.number().optional(),
  message: bilingualMessageSchema.optional(),
  data: z.array(articleResponseDtoSchema),
  meta: paginationMetaSchema.optional(),
  timestamp: z.string().optional(),
})

export type ArticlesListResponse = z.infer<typeof articlesListResponseSchema>

export function parseArticleGetByIdResponse(raw: unknown): ArticleResponseDto {
  const asRecord =
    raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null
  if (
    asRecord &&
    'data' in asRecord &&
    asRecord.data &&
    typeof asRecord.data === 'object' &&
    !Array.isArray(asRecord.data)
  ) {
    return articleResponseDtoSchema.parse(asRecord.data)
  }
  return articleResponseDtoSchema.parse(raw)
}

function parseArticleItems(data: unknown): ArticleResponseDto[] {
  if (!Array.isArray(data)) return []
  return data.flatMap((item) => {
    const parsed = articleResponseDtoSchema.safeParse(item)
    return parsed.success ? [parsed.data] : []
  })
}

export function parseArticlesListResponse(raw: unknown): ArticlesListResponse {
  const asRecord =
    raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null
  if (!asRecord) {
    return { data: [] }
  }

  let data = asRecord.data
  let meta = asRecord.meta

  if (
    data &&
    typeof data === 'object' &&
    !Array.isArray(data) &&
    'data' in (data as object)
  ) {
    const inner = data as Record<string, unknown>
    data = inner.data
    meta = meta ?? inner.meta
  }

  const parsedMeta = meta ? paginationMetaSchema.safeParse(meta) : null

  return {
    success: asRecord.success as boolean | undefined,
    statusCode: asRecord.statusCode as number | undefined,
    message: asRecord.message as ArticlesListResponse['message'],
    data: parseArticleItems(data),
    meta: parsedMeta?.success ? parsedMeta.data : undefined,
    timestamp: asRecord.timestamp as string | undefined,
  }
}
