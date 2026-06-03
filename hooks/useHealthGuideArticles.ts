'use client'

import { useQuery } from '@tanstack/react-query'
import { getToken } from '@/lib/api/auth'
import { fetchAllArticlePages } from '@/lib/api/articles'
import { mapArticleDtoToUi } from '@/lib/mappers/article'
import type { Article, ArticleUiCategory } from '@/schemas/healthGuide'
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
      const dtos = await fetchAllArticlePages()
      return dtos.map(mapArticleDtoToUi)
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
