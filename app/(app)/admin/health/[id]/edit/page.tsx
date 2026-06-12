import AddFacilityContent from '@/components/admin/health/setup/AddFacilityContent'
import type { AdminHealthFacilityType } from '@/schemas/adminHealth'

interface EditFacilityPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function EditFacilityPage({ params, searchParams }: EditFacilityPageProps) {
  const { id } = await params
  const resolved = await searchParams
  const facilityType = resolved.type as AdminHealthFacilityType | undefined
  return <AddFacilityContent facilityId={id} facilityType={facilityType} />
}
