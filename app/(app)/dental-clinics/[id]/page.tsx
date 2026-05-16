import DashboardFullBleedPanel from '@/components/dashboard/DashboardFullBleedPanel'
import HealthServicesPage from '@/components/health/HealthServicesPage'

export default async function DentalClinicDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <DashboardFullBleedPanel>
      <HealthServicesPage category="dental" facilityId={id} />
    </DashboardFullBleedPanel>
  )
}
