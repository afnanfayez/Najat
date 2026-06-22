import { getToken } from '@/lib/api/auth'
import { fetchWithTimeout } from '@/lib/api/fetchWithTimeout'
import { getApiResponse, putApiResponse } from '@/lib/offline/db'

async function readCachedGet(key: string): Promise<unknown> {
  if (typeof window === 'undefined') return undefined
  try {
    return await getApiResponse(key)
  } catch {
    return undefined
  }
}

function writeCachedGet(key: string, data: unknown): void {
  if (typeof window === 'undefined') return
  try {
    void putApiResponse(key, data)
  } catch {
    // ignore cache write failures
  }
}

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  ''
const V1_ROOT = process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'

function extractMessage(msg: unknown): string | undefined {
  if (!msg) return undefined
  if (typeof msg === 'string') return msg
  if (typeof msg === 'object' && msg !== null) {
    const m = msg as Record<string, string>
    return m.ar ?? m.en
  }
  return String(msg)
}

function buildHeaders(options: RequestInit): HeadersInit {
  const merged = new Headers(options.headers as HeadersInit)
  const body = options.body
  const isFormData =
    typeof FormData !== 'undefined' && body instanceof FormData

  if (isFormData) {
    merged.delete('Content-Type')
  } else if (!merged.has('Content-Type')) {
    merged.set('Content-Type', 'application/json')
  }

  const token = getToken()
  if (token && !merged.has('Authorization')) {
    merged.set('Authorization', `Bearer ${token}`)
  }

  // Prevent browser and proxy caching of API calls
  merged.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  merged.set('Pragma', 'no-cache')
  merged.set('Expires', '0')

  return merged
}

/**
 * Backend wraps paginated results as { data: { data: [], meta: {} } }.
 * This flattens it to { data: [], meta: {} } so schemas and callers stay clean.
 */
export function unwrapPaginated(raw: unknown): unknown {
  if (
    raw != null &&
    typeof raw === 'object' &&
    'data' in raw &&
    raw.data != null &&
    typeof raw.data === 'object' &&
    !Array.isArray(raw.data) &&
    'data' in (raw.data as object)
  ) {
    const inner = raw.data as Record<string, unknown>
    return { ...(raw as object), data: inner.data, meta: inner.meta }
  }
  return raw
}

export function isConnectivityError(err: any): boolean {
  if (!err) return false
  const status = err.status
  return status === 0 || status === 502 || status === 504 || status === undefined
}

export async function request(endpoint: string, options: RequestInit = {}) {
  let url = `${BASE_URL}${endpoint}`

  const matchAidRequest = endpoint.match(/\/aid\/([^/]+)\/requests$/)
  if (endpoint === `${V1_ROOT}/auth/me` || endpoint === '/v1/auth/me') {
    url = '/api/profile'
  } else if (endpoint === `${V1_ROOT}/aid/requests` || endpoint === '/v1/aid/requests') {
    url = '/api/aid-requests'
  } else if (matchAidRequest && (options.method ?? 'GET').toUpperCase() === 'POST') {
    const orgId = matchAidRequest[1]
    url = `/api/aid-requests?aidOrganizationId=${encodeURIComponent(orgId)}`
  }

  const method = (options.method ?? 'GET').toUpperCase()
  const isGet = method === 'GET'

  const config: RequestInit = {
    cache: 'no-store', // Disable browser and Next.js fetch caching
    ...options,
    headers: buildHeaders(options),
  }

  try {
    const res = await fetchWithTimeout(url, config)

    let data: any = {}
    const contentType = res.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      data = await res.json()
    } else {
      const text = await res.text()
      data = { message: text || res.statusText }
    }

    if (!res.ok) {
      const rawMsg = data?.message ?? data?.error ?? data?.detail
      throw {
        status: res.status,
        message: extractMessage(rawMsg) ?? 'Something went wrong',
        errors: data?.errors ?? null,
        detail: data?.detail ?? null,
        fullData: data,
      }
    }

    // Cache successful GET reads so they can be served offline.
    if (isGet) writeCachedGet(url, data)

    return data
  } catch (err: any) {
    // If it's already our custom error object (real HTTP status), re-throw it.
    if (err.status) throw err
    // Network error (offline / CORS / reset): serve the last cached GET if any.
    if (isGet) {
      const cached = await readCachedGet(url)
      if (cached !== undefined) return cached
    }
    throw {
      status: 0,
      message: extractMessage(err?.message) ?? 'Network error / CORS issue',
      errors: null,
    }
  }
}

export const authAPI = {
  register: (body: any) =>
    request(`${V1_ROOT}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: any) =>
    request(`${V1_ROOT}/auth/login`, { method: 'POST', body: JSON.stringify(body) }),

  verify: (body: any) =>
    request(`${V1_ROOT}/auth/verify`, { method: 'POST', body: JSON.stringify(body) }),

  forgotPassword: (body: { email: string }) =>
    request(`${V1_ROOT}/auth/forgot-password`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  resetPassword: (body: { email: string; code: string; newPassword: string }) =>
    request(`${V1_ROOT}/auth/reset-password`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  me: () => request(`${V1_ROOT}/auth/me`),
}
