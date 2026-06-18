import type { HealthFacility } from '@/schemas/healthFacility'
import type { HumanitarianAid } from '@/schemas/humanitarianAid'
import type { Article } from '@/schemas/healthGuide'
import { IMAGE_CACHE } from '@/lib/pwa/cacheNames'

/**
 * Warm an image into the durable image cache under its EXACT rendered URL so the
 * Service Worker (which keys by request URL) finds it offline.
 *
 * Components render remote media via a raw <img src={remoteUrl}> (cross-origin),
 * so we warm the raw remote URL with a no-cors fetch (opaque response) — NOT the
 * /_next/image optimizer URL, which those <img> tags never request.
 */
async function cacheImage(url: string): Promise<void> {
  if (typeof caches === 'undefined') return
  try {
    const cache = await caches.open(IMAGE_CACHE)
    if (await cache.match(url)) return // already warmed — don't re-download

    const isRemote = url.startsWith('http://') || url.startsWith('https://')
    const response = await fetch(url, { mode: isRemote ? 'no-cors' : 'same-origin' })
    if (response && (response.ok || response.type === 'opaque')) {
      await cache.put(url, response)
    }
  } catch {
    // ignore — best effort
  }
}

export async function warmImageUrls(urls: string[]): Promise<void> {
  const unique = [...new Set(urls.filter(Boolean))]
  await Promise.allSettled(unique.map((url) => cacheImage(url)))
}

export function collectFacilityImageUrls(facilities: HealthFacility[]): string[] {
  return facilities.map((f) => f.imageUrl).filter((u): u is string => Boolean(u))
}

export function collectAidImageUrls(aid: HumanitarianAid[]): string[] {
  return aid
    .map((a) => (a as HumanitarianAid & { imageUrl?: string }).imageUrl)
    .filter((u): u is string => Boolean(u))
}

export function collectArticleImageUrls(articles: Article[]): string[] {
  return articles.map((a) => a.image).filter((u): u is string => Boolean(u))
}

export async function warmOfflineImages(input: {
  facilities?: HealthFacility[]
  aid?: HumanitarianAid[]
  articles?: Article[]
}): Promise<void> {
  const urls = [
    ...collectFacilityImageUrls(input.facilities ?? []),
    ...collectAidImageUrls(input.aid ?? []),
    ...collectArticleImageUrls(input.articles ?? []),
    '/assets/Logo1.png',
    '/assets/Logo2.png',
    '/assets/Photo1.png',
    '/assets/najat-icon-192.png',
    '/assets/najat-icon-512.png',
  ]
  await warmImageUrls(urls)
}
