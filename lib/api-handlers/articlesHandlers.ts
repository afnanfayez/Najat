import type { SupabaseClient } from '@supabase/supabase-js'
import { envelope, errorEnvelope, listEnvelope } from './envelope'
import { parsePagination, buildMeta } from './pagination'
import { toSnakeCase, toCamelCase } from './caseMapping'

// Articles need a nested `author: {id, fullName, role}` object (see
// schemas/articleApi.ts's authorResponseDtoSchema) — not something the
// generic crudFactory's flat top-level mapping produces (it would only
// return a flat `authorId`), so this domain gets its own thin handlers
// instead of createSupabaseCrudHandlers(). See docs/BACKEND_API_SPEC.md §9.
const SELECT_WITH_AUTHOR = '*, author:profiles(id, full_name, role)'
const DEFAULT_LIMIT = 50

function mapRow(row: Record<string, unknown>) {
  const { author, ...rest } = row
  const mapped = toCamelCase(rest) as Record<string, unknown>
  if (author && typeof author === 'object') {
    const a = author as Record<string, unknown>
    mapped.author = { id: a.id, fullName: a.full_name, role: a.role }
  } else {
    mapped.author = null
  }
  return mapped
}

export async function listArticles(supabase: SupabaseClient, searchParams: URLSearchParams) {
  const { page, limit, from, to } = parsePagination(searchParams, DEFAULT_LIMIT)
  const { data, error, count } = await supabase
    .from('articles')
    .select(SELECT_WITH_AUTHOR, { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(from, to)
  if (error) return errorEnvelope(error.message, 500)
  const meta = buildMeta(page, limit, count ?? 0)
  return listEnvelope((data ?? []).map(mapRow), meta)
}

export async function getArticleById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('articles')
    .select(SELECT_WITH_AUTHOR)
    .eq('id', id)
    .single()
  if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
  return envelope(mapRow(data))
}

export async function createArticle(supabase: SupabaseClient, body: Record<string, unknown>) {
  const record = toSnakeCase(body)
  delete record.id
  delete record.created_at
  delete record.updated_at
  delete record.author
  const { data, error } = await supabase
    .from('articles')
    .insert(record)
    .select(SELECT_WITH_AUTHOR)
    .single()
  if (error) return errorEnvelope(error.message, 400)
  return envelope(mapRow(data), 201)
}

export async function updateArticle(supabase: SupabaseClient, id: string, body: Record<string, unknown>) {
  const record = toSnakeCase(body)
  delete record.id
  delete record.created_at
  delete record.author
  const { data, error } = await supabase
    .from('articles')
    .update(record)
    .eq('id', id)
    .select(SELECT_WITH_AUTHOR)
    .single()
  if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
  return envelope(mapRow(data))
}

export async function removeArticle(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('articles')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .select('id')
    .single()
  if (error || !data) return errorEnvelope('العنصر غير موجود', 404)
  return envelope({ success: true })
}
