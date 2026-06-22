import { NextResponse } from 'next/server'

/**
 * /api/ping — lightweight connectivity probe.
 *
 * The Service Worker explicitly skips all /api/* requests so this endpoint
 * is NEVER served from the SW cache. useOnlineStatus uses it to distinguish
 * "browser reports online but SW is answering from cache" from "actually online".
 *
 * Cache-Control: no-store so browsers / CDNs never cache it either.
 */
export function GET() {
  return NextResponse.json(
    { ok: true, ts: Date.now() },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
      },
    },
  )
}
