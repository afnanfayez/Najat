import type { SupabaseClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'

function tryParseJsonLike(value: string): unknown {
  const trimmed = value.trim()
  const looksLikeJson =
    (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
    (trimmed.startsWith('{') && trimmed.endsWith('}'))
  if (!looksLikeJson) return value
  try {
    return JSON.parse(trimmed)
  } catch {
    return value
  }
}

/**
 * Parses a Route Handler request body that may be JSON or multipart FormData
 * (image upload) — the frontend API modules (lib/api/hospitals.ts,
 * lib/api/articles.ts, etc.) send either depending on whether an image file
 * is attached. File entries are uploaded to Supabase Storage and replaced
 * with their public URL. Array/object-like form field strings are JSON-parsed,
 * mirroring lib/mocks/formDataUtils.ts's convention — but real files are
 * persisted to Storage instead of inlined as base64 (see
 * docs/BACKEND_API_SPEC.md §0, §12.5).
 */
export async function parseRequestBody(
  req: NextRequest,
  supabase: SupabaseClient,
  options: { bucket: string; pathPrefix: string },
): Promise<Record<string, unknown>> {
  const contentType = req.headers.get('content-type') ?? ''
  if (!contentType.includes('multipart/form-data')) {
    return req.json().catch(() => ({}))
  }

  const fd = await req.formData()
  const out: Record<string, unknown> = {}
  for (const [key, value] of fd.entries()) {
    if (value instanceof File) {
      if (value.size === 0) continue
      const ext = value.name.includes('.') ? value.name.split('.').pop() : 'bin'
      const path = `${options.pathPrefix}/${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage.from(options.bucket).upload(path, value, {
        contentType: value.type || undefined,
        upsert: true,
      })
      if (error) throw error
      const { data } = supabase.storage.from(options.bucket).getPublicUrl(path)
      out[key] = data.publicUrl
      continue
    }
    out[key] = tryParseJsonLike(value)
  }
  return out
}
