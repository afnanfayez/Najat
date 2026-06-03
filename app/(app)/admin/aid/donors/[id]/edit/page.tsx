import DonorEditorContent from '@/components/admin/aid/donors/setup/DonorEditorContent'

interface EditDonorPageProps {
  params: Promise<{ id: string }>
}

export default async function EditDonorPage({ params }: EditDonorPageProps) {
  const { id } = await params
  return <DonorEditorContent donorId={id} />
}
