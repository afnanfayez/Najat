import { notFound } from 'next/navigation'
import { ARTICLES } from '@/data/healthGuideData'
import ArticleDetailPage from '@/components/guide/ArticleDetailPage'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return ARTICLES.map(a => ({ id: a.id }))
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const article = ARTICLES.find(a => a.id === id)
  return {
    title: article?.title ?? 'مقال صحي',
    description: article?.desc ?? '',
  }
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params
  const article = ARTICLES.find(a => a.id === id)
  if (!article) notFound()
  return <ArticleDetailPage article={article} />
}
