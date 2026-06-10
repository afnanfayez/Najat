import type { HealthFacility } from '@/schemas/healthFacility'
import type { HumanitarianAid } from '@/schemas/humanitarianAid'
import type { Article } from '@/schemas/healthGuide'

function nextImageUrl(remoteUrl: string, width = 640): string {
  return `/_next/image?url=${encodeURIComponent(remoteUrl)}&w=${width}&q=75`
}

async function warmUrl(url: string): Promise<void> {
  try {
    await fetch(url, { mode: 'same-origin' })
  } catch {
    // ignore
  }
}

export async function warmImageUrls(urls: string[]): Promise<void> {
  const unique = [...new Set(urls.filter(Boolean))]
  await Promise.allSettled(
    unique.map(async (url) => {
      if (url.startsWith('/assets/') || url.startsWith('/')) {
        await warmUrl(url)
        return
      }
      if (url.startsWith('http://') || url.startsWith('https://')) {
        await warmUrl(nextImageUrl(url))
        await warmUrl(nextImageUrl(url, 1280))
      }
    }),
  )
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
