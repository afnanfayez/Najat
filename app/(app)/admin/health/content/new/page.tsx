import MedicalContentEditorContent from '@/components/admin/health/content/MedicalContentEditorContent'
import type { AdminHealthContentCategory } from '@/schemas/adminHealth'

interface NewMedicalContentPageProps {
  searchParams: Promise<{ category?: string }>
}

const VALID_CATEGORIES: AdminHealthContentCategory[] = [
  'first-aid',
  'awareness',
  'mental-health',
]

export default async function NewMedicalContentPage({
  searchParams,
}: NewMedicalContentPageProps) {
  const { category } = await searchParams
  const defaultCategory = VALID_CATEGORIES.includes(
    category as AdminHealthContentCategory,
  )
    ? (category as AdminHealthContentCategory)
    : 'first-aid'

  return <MedicalContentEditorContent defaultCategory={defaultCategory} />
}
