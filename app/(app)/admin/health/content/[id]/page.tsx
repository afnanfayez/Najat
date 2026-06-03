import MedicalContentEditorContent from '@/components/admin/health/content/MedicalContentEditorContent'
import type { AdminHealthContentCategory } from '@/schemas/adminHealth'

interface EditMedicalContentPageProps {
  params: Promise<{ id: string }>
}

export default async function EditMedicalContentPage({
  params,
}: EditMedicalContentPageProps) {
  const { id } = await params
  return <MedicalContentEditorContent contentId={id} />
}
