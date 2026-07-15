/**
 * Converts request bodies (FormData with possible image File entries, or a
 * JSON string) into a plain record the mock CRUD layer can merge/persist.
 *
 * Uploaded images are persisted as base64 data-URLs (object URLs from
 * `URL.createObjectURL` don't survive a page reload) — capped at ~1.5MB so a
 * large test image degrades gracefully instead of blowing the localStorage quota.
 */

const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

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

export async function formDataToRecord(
  fd: FormData,
): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of fd.entries()) {
    if (value instanceof File) {
      if (value.size === 0) continue
      if (value.size > MAX_IMAGE_BYTES) {
        console.warn(
          `[mock-store] image "${value.name}" (${value.size} bytes) exceeds the ${MAX_IMAGE_BYTES}-byte mock-mode limit; ignoring upload and keeping the previous image.`,
        )
        continue
      }
      try {
        out[key] = await fileToDataUrl(value)
      } catch {
        console.warn(`[mock-store] failed to read uploaded file "${value.name}"`)
      }
      continue
    }
    out[key] = tryParseJsonLike(value)
  }
  return out
}

/** Shape of a `request()`/mock-router request body. */
export type MockRequestBody = FormData | Record<string, unknown> | string | null | undefined

/** Normalizes a `request()` body (FormData | JSON string | plain object | undefined) into a record. */
export async function bodyToRecord(
  body: MockRequestBody,
): Promise<Record<string, unknown>> {
  if (!body) return {}
  if (body instanceof FormData) return formDataToRecord(body)
  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      return {}
    }
  }
  return body
}
