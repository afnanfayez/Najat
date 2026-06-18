import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LOGIN_PATH = '/login'
const REGISTER_PATH = '/register'

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    // atob is available in the Next.js Edge Runtime
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded) as Record<string, unknown>
  } catch {
    return null
  }
}

function isTokenExpired(payload: Record<string, unknown>): boolean {
  const exp = payload.exp
  if (typeof exp !== 'number') return false
  return Date.now() / 1000 > exp
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value ?? null

  // Decode role from JWT (no secret verification — edge runtime constraint;
  // API endpoints enforce auth independently with full signature verification)
  let role: string | null = null
  let tokenValid = false
  if (token) {
    const payload = decodeJwtPayload(token)
    if (payload && !isTokenExpired(payload)) {
      role = typeof payload.role === 'string' ? payload.role : null
      tokenValid = true
    }
  }

  const isAuthenticated = tokenValid

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && (pathname === LOGIN_PATH || pathname === REGISTER_PATH)) {
    const dest = role === 'admin' ? '/admin' : role === 'volunteer' ? '/volunteer' : '/dashboard'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  // Protect all app routes — require authentication
  if (!isAuthenticated) {
    const loginUrl = new URL(LOGIN_PATH, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Protect /admin/* — require admin role
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect /volunteer/* — require volunteer or admin role
  if (pathname.startsWith('/volunteer') && role !== 'volunteer' && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - /login and /register (public auth pages)
     * - /api/* (Next.js API routes — have their own auth)
     * - /_next/* (Next.js internals)
     * - /static/* and public files (incl. /assets/* — public images/fonts that
     *   must never be auth-gated, otherwise the image optimizer's cookie-less
     *   server-side fetch is redirected to /login and every next/image of a
     *   local asset fails with "isn't a valid image")
     */
    '/((?!login|register|api|_next/static|_next/image|favicon.ico|icons|assets|manifest|precache-manifest|sw\\.js|workbox|offline).*)',
  ],
}
