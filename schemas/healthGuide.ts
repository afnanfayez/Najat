export type ArticleUiCategory = 'first-aid' | 'articles' | 'mental'

export interface Article {
  id: string
  title: string
  desc: string
  category: ArticleUiCategory
  readTime: string
  readTimeMinutes?: number
  image?: string
  content: string
  viewsCount?: number
  authorName?: string
}

export type HealthGuideEmotion = {
  emoji: string
  label: string
  desc: string
}

export type HealthGuideMentalTip = {
  title: string
  desc: string
}

export type HealthGuideMentalTool = {
  label: string
  icon: string
}
