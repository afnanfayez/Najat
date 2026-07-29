import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getArticleById, updateArticle, removeArticle } from '@/lib/api-handlers/articlesHandlers'
import { parseRequestBody } from '@/lib/api-handlers/parseRequestBody'
import { errorEnvelope } from '@/lib/api-handlers/envelope'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  return getArticleById(supabase, id)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  try {
    const body = await parseRequestBody(req, supabase, { bucket: 'article-images', pathPrefix: 'articles' })
    return updateArticle(supabase, id, body)
  } catch (err) {
    return errorEnvelope(err instanceof Error ? err.message : 'تعذّر رفع الصورة', 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  return removeArticle(supabase, id)
}
