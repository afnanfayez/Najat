import AdminAuditCompareContent from '@/components/admin/audit/compare/AdminAuditCompareContent'

interface AdminAuditComparePageProps {
  params: Promise<{ id: string }>
}

export default async function AdminAuditComparePage({ params }: AdminAuditComparePageProps) {
  const { id } = await params
  return <AdminAuditCompareContent reportId={id} />
}
