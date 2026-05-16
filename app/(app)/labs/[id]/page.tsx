import DashboardFullBleedPanel from '@/components/dashboard/DashboardFullBleedPanel'
import HealthServicesPage from '@/components/health/HealthServicesPage'

export default async function LabDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <DashboardFullBleedPanel>
      <HealthServicesPage category="labs" facilityId={id} />
    </DashboardFullBleedPanel>
  )
}
