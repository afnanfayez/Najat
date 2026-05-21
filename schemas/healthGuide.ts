export interface Article {
  id: string
  title: string
  desc: string
  category: 'first-aid' | 'articles' | 'mental'
  readTime: string
  image?: string
  content: {
    intro: string
    steps: { title: string; body: string }[]
    warning?: string
    tip?: string
  }
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
