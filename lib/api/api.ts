const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  try {
    const res = await fetch(url, config)
    
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
        message: rawMsg ?? 'Something went wrong',
        errors: data?.errors ?? null,
        detail: data?.detail ?? null,
        fullData: data,
      }
    }

    return data
  } catch (err: any) {
    const safeMsg =
      err?.message != null && typeof err.message === 'object'
        ? JSON.stringify(err.message)
        : err?.message
    // If it's already our custom error object, re-throw it
    if (err.status) throw err
    // Otherwise, it's a network error (like CORS or connection reset)
    throw {
      status: 0,
      message: err.message || 'Network error / CORS issue',
      errors: null
    }
  }
}

export const authAPI = {
  register: (body: any) =>
    request('/v1/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: any) =>
    request('/v1/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  verify: (body: any) =>
    request('/v1/auth/verify', { method: 'POST', body: JSON.stringify(body) }),

  forgotPassword: (body: { email: string }) =>
    request('/v1/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),

  resetPassword: (body: { email: string; code: string; newPassword: string }) =>
    request('/v1/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
}