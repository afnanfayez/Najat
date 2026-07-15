/**
 * Reserved values that let QA/devs deliberately trigger error UI without a real backend.
 * Use them anywhere an id or `since` param is accepted, e.g. GET /hospitals/mock-error-404.
 */

/** Shaped like the error `request()`'s real fetch path throws on a non-2xx response. */
export class MockHttpError extends Error {
  status: number
  errors: unknown

  constructor(status: number, message: string, errors: unknown = null) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

const TRIGGER_RE = /^mock-error-(400|401|403|404|500|network)$/

const MESSAGES: Record<string, string> = {
  '400': 'طلب غير صالح (محاكاة اختبار)',
  '401': 'غير مصرح (محاكاة اختبار)',
  '403': 'ممنوع (محاكاة اختبار)',
  '404': 'العنصر غير موجود (محاكاة اختبار)',
  '500': 'خطأ داخلي في الخادم (محاكاة اختبار)',
}

/**
 * Throws a synthetic error matching the reserved value, if any.
 * `mock-error-network` throws a plain Error (no `.status`) so it flows through
 * the same "network error → serve offline cache" branch as a real connectivity
 * failure — the same mechanism, not a separate one.
 */
export function checkErrorTrigger(value: string | undefined | null): void {
  if (!value) return
  const match = TRIGGER_RE.exec(value.trim())
  if (!match) return
  const code = match[1]
  if (code === 'network') {
    throw new Error('Simulated network failure (mock-error-network)')
  }
  throw new MockHttpError(Number(code), MESSAGES[code])
}
