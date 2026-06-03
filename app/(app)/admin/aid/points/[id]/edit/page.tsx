import DistributionPointEditorContent from '@/components/admin/aid/setup/DistributionPointEditorContent'

interface EditDistributionPointPageProps {
  params: Promise<{ id: string }>
}

export default async function EditDistributionPointPage({
  params,
}: EditDistributionPointPageProps) {
  const { id } = await params
  return <DistributionPointEditorContent pointId={id} />
}
