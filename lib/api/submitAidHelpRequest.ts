import { getToken } from '@/lib/api/auth'
import type { AidHelpRequestForm } from '@/schemas/aidHelpRequest'

function bilingualOrString(msg: unknown): string {
  if (msg && typeof msg === 'object' && msg !== null && ('ar' in msg || 'en' in msg)) {
    const m = msg as Record<string, string | undefined>
    return m.ar ?? m.en ?? 'حدث خطأ'
  }
  if (typeof msg === 'string') return msg
  return 'حدث خطأ'
}

/**
 * Posts to the Next.js route (which may forward to `AID_HELP_REQUEST_BACKEND_URL`).
 */
export async function submitAidHelpRequest(
  payload: AidHelpRequestForm,
): Promise<{ ok: true; message: string } | { ok: false; message: string }> {
  const token = getToken()
  const res = await fetch('/api/aid-help-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  let body: Record<string, unknown> = {}
  try {
    body = (await res.json()) as Record<string, unknown>
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    return {
      ok: false,
      message: bilingualOrString(body.message ?? body.error),
    }
  }

  return {
    ok: true,
    message: bilingualOrString(body.message) || 'تم استلام طلبك بنجاح',
  }
}
