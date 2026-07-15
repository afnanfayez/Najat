import { createCrudResource } from '@/lib/mocks/crud/createCrudResource'
import { seedArticles } from '@/lib/mocks/seeds/articles.seed'
import type { ArticleResponseDto } from '@/schemas/articleApi'

export const articlesResource = createCrudResource<ArticleResponseDto & { deletedAt?: string | null }>({
  storageKey: 'articles',
  seedVersion: 1,
  seed: seedArticles,
  softDelete: true,
  defaultLimit: 50,
})
