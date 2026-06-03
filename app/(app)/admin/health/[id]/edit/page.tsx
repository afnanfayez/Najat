import AddFacilityContent from '@/components/admin/health/setup/AddFacilityContent'

interface EditFacilityPageProps {
  params: Promise<{ id: string }>
}

export default async function EditFacilityPage({ params }: EditFacilityPageProps) {
  const { id } = await params
  return <AddFacilityContent facilityId={id} />
}
