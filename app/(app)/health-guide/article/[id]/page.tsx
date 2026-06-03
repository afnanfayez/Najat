import ArticleDetailPage from '@/components/guide/ArticleDetailPage'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params
  return <ArticleDetailPage articleId={id} />
}
