'use client'

import { useQuery } from '@tanstack/react-query'
import { getToken } from '@/lib/api/auth'
import { articlesAPI } from '@/lib/api/articles'
import { mapArticleDtoToUi } from '@/lib/mappers/article'
import type { Article } from '@/schemas/healthGuide'
import { getArticleById, putArticles } from '@/lib/offline/db'
import { useAuth } from '@/context/AuthContext'

export function useArticle(id: string) {
  const { isHydrated } = useAuth()

  const query = useQuery({
    queryKey: ['health-guide', 'article', id],
    queryFn: async (): Promise<Article> => {
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

      if (isOffline) {
        const cached = await getArticleById(id)
        if (cached) return cached
        throw new Error('المقال غير متوفر دون اتصال')
      }

      try {
        const dto = await articlesAPI.getById(id)
        const article = mapArticleDtoToUi(dto)
        await putArticles([article]).catch(() => {})
        return article
      } catch (e) {
        const cached = await getArticleById(id)
        if (cached) return cached
        throw e
      }
    },
    enabled: isHydrated && Boolean(getToken()) && Boolean(id),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  })

  const isLoading = !isHydrated || query.isLoading

  return { ...query, isLoading }
}
