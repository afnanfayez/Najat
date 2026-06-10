'use client'

import { useQuery } from '@tanstack/react-query'
import { getToken } from '@/lib/api/auth'
import { fetchAllArticlePages } from '@/lib/api/articles'
import { mapArticleDtoToUi } from '@/lib/mappers/article'
import type { Article, ArticleUiCategory } from '@/schemas/healthGuide'
import { getAllArticles, putArticles } from '@/lib/offline/db'
import { useAuth } from '@/context/AuthContext'

export type HealthGuideArticlesParams = {
  category?: ArticleUiCategory
  search?: string
}

function filterBySearch(list: Article[], search?: string): Article[] {
  const q = search?.trim()
  if (!q) return list
  return list.filter(
    (a) => a.title.includes(q) || a.desc.includes(q) || a.content.includes(q),
  )
}

function filterByCategory(
  list: Article[],
  category?: ArticleUiCategory,
): Article[] {
  if (!category) return list
  return list.filter((a) => a.category === category)
}

export function useHealthGuideArticles(params?: HealthGuideArticlesParams) {
  const { isHydrated } = useAuth()

  const query = useQuery({
    queryKey: ['health-guide', 'articles'],
    queryFn: async (): Promise<Article[]> => {
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

      if (isOffline) {
        return getAllArticles()
      }

      try {
        const dtos = await fetchAllArticlePages()
        const articles = dtos.map(mapArticleDtoToUi)
        if (articles.length > 0) {
          putArticles(articles).catch(() => {})
        }
        return articles
      } catch (e) {
        console.warn('Articles fetch failed, falling back to offline DB', e)
        return getAllArticles()
      }
    },
    select: (articles) =>
      filterBySearch(filterByCategory(articles, params?.category), params?.search),
    enabled: isHydrated && Boolean(getToken()),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  })

  const isLoading = !isHydrated || query.isLoading

  return { ...query, isLoading }
}
