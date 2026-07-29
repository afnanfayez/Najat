import type { SupabaseClient } from '@supabase/supabase-js'

const EXT_BY_CONTENT_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

/**
 * Uploads a `data:` URL (e.g. from a client-side crop/preview step) to a
 * Supabase Storage bucket and returns its public URL. Replaces the mock
 * layer's inline-base64-in-record image handling — see
 * docs/BACKEND_API_SPEC.md §0, §12.5.
 */
export async function uploadDataUrlImage(
  supabase: SupabaseClient,
  bucket: string,
  pathPrefix: string,
  dataUrl: string,
): Promise<string> {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) throw new Error('Invalid data URL')
  const [, contentType, base64] = match
  const ext = EXT_BY_CONTENT_TYPE[contentType] ?? 'bin'
  const buffer = Buffer.from(base64, 'base64')
  const path = `${pathPrefix}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType,
    upsert: true,
  })
  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
