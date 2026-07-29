/**
 * GET/POST /api/v1/articles — backed by the `articles` table under RLS
 * (public read, admin-only write). Default page size is 50, not 20 — see
 * docs/BACKEND_API_SPEC.md §9. No nearby endpoint for this domain.
 */
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listArticles, createArticle } from '@/lib/api-handlers/articlesHandlers'
import { parseRequestBody } from '@/lib/api-handlers/parseRequestBody'
import { errorEnvelope } from '@/lib/api-handlers/envelope'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  return listArticles(supabase, req.nextUrl.searchParams)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  try {
    const body = await parseRequestBody(req, supabase, { bucket: 'article-images', pathPrefix: 'articles' })
    return createArticle(supabase, body)
  } catch (err) {
    return errorEnvelope(err instanceof Error ? err.message : 'تعذّر رفع الصورة', 500)
  }
}
