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

  const res = await fetch(url, config)
  const data = await res.json()

  if (!res.ok) {
    throw {
      status: res.status,
      message: data?.message || 'Something went wrong',
      errors: data?.errors || null,
    }
  }

  return data
}

export const authAPI = {
  register: (body: any) =>
    request('/v1/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: any) =>
    request('/v1/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  verify: (body: any) =>
    request('/v1/auth/verify', { method: 'POST', body: JSON.stringify(body) }),
}