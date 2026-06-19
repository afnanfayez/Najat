import type { ArticleCategory } from '@/schemas/articleApi'
import type { Article, ArticleUiCategory } from '@/schemas/healthGuide'
import { resolveImageUrl } from '@/lib/utils'

const DEFAULT_IMAGE = '/assets/healthcare1.jpg'

export function truncateDesc(content: string, maxLen = 120): string {
  const flat = content.replace(/\s+/g, ' ').trim()
  if (flat.length <= maxLen) return flat
  return `${flat.slice(0, maxLen).trim()}…`
}

export function mapApiCategoryToUi(
  category: ArticleCategory,
): ArticleUiCategory {
  switch (category) {
    case 'awareness':
      return 'articles'
    case 'mental-health':
      return 'mental'
    default:
      return 'first-aid'
  }
}

export function mapUiCategoryToApi(
  category: ArticleUiCategory,
): ArticleCategory {
  switch (category) {
    case 'articles':
      return 'awareness'
    case 'mental':
      return 'mental-health'
    default:
      return 'first-aid'
  }
}

export function mapArticleDtoToUi(dto: {
  id: string
  titleAr: string
  contentAr: string
  category: ArticleCategory
  image?: string | null
  readTime: number
  viewsCount: number
  author?: { fullName: string } | null
}): Article {
  return {
    id: dto.id,
    title: dto.titleAr,
    desc: truncateDesc(dto.contentAr),
    content: dto.contentAr,
    category: mapApiCategoryToUi(dto.category),
    readTime: `${dto.readTime} دقائق`,
    readTimeMinutes: dto.readTime,
    image: resolveImageUrl(dto.image?.trim()) || DEFAULT_IMAGE,
    viewsCount: dto.viewsCount,
    authorName: dto.author?.fullName,
  }
}

export function formatViewsCount(count: number): string {
  if (count >= 1_000_000) {
    const m = count / 1_000_000
    return `${m >= 10 ? Math.round(m) : Math.round(m * 10) / 10}M مشاهدة`
  }
  if (count >= 1000) {
    const k = count / 1000
    return `${k >= 10 ? Math.round(k) : Math.round(k * 10) / 10}k مشاهدة`
  }
  return `${count} مشاهدة`
}

export function formatReadTimeLabel(readTime: string | number): string {
  if (typeof readTime === 'number') {
    return `${readTime} دقائق قراءة`
  }
  if (readTime.includes('قراءة')) return readTime
  return `${readTime} قراءة`
}

export function getCategoryLabel(category: ArticleUiCategory): string {
  switch (category) {
    case 'first-aid':
      return 'إسعافات أولية'
    case 'mental':
      return 'صحة نفسية'
    default:
      return 'مقالات توعوية'
  }
}
