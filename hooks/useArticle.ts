'use client'

import { useQuery } from '@tanstack/react-query'
import { getToken } from '@/lib/api/auth'
import { articlesAPI } from '@/lib/api/articles'
import { mapArticleDtoToUi } from '@/lib/mappers/article'
import type { Article } from '@/schemas/healthGuide'
import { useAuth } from '@/context/AuthContext'

export function useArticle(id: string) {
  const { isHydrated } = useAuth()

  const query = useQuery({
    queryKey: ['health-guide', 'article', id],
    queryFn: async (): Promise<Article> => {
      const dto = await articlesAPI.getById(id)
      return mapArticleDtoToUi(dto)
    },
    enabled: isHydrated && Boolean(getToken()) && Boolean(id),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  })

  const isLoading = !isHydrated || query.isLoading

  return { ...query, isLoading }
}
