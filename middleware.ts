import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const LOGIN_PATH = '/login'
const REGISTER_PATH = '/register'
const VERIFY_PATH = '/verify'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { response, user, role } = await updateSession(request)
  const isAuthenticated = Boolean(user)

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && (pathname === LOGIN_PATH || pathname === REGISTER_PATH || pathname === VERIFY_PATH)) {
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

  return response
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - /login, /register, and /verify (public auth pages — /verify must stay
     *   reachable without a session since a just-registered, unconfirmed user
     *   has none yet)
     * - /api/* (Next.js API routes — have their own auth)
     * - /_next/* (Next.js internals)
     * - /static/* and public files (incl. /assets/* — public images/fonts that
     *   must never be auth-gated, otherwise the image optimizer's cookie-less
     *   server-side fetch is redirected to /login and every next/image of a
     *   local asset fails with "isn't a valid image")
     */
    '/((?!login|register|verify|api|_next/static|_next/image|favicon.ico|icons|assets|manifest|precache-manifest|sw\\.js|workbox|offline).*)',
  ],
}
