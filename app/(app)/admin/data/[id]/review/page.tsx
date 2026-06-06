import AdminDataReviewContent from '@/components/admin/data/review/AdminDataReviewContent'

interface AdminDataReviewPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminDataReviewPage({ params }: AdminDataReviewPageProps) {
  const { id } = await params
  return <AdminDataReviewContent requestId={id} />
}
