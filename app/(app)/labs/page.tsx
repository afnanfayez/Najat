import DashboardFullBleedPanel from '@/components/dashboard/DashboardFullBleedPanel'
import HealthServicesPage from '@/components/health/HealthServicesPage'

export default function LabsPage() {
  return (
    <DashboardFullBleedPanel>
      <HealthServicesPage category="labs" />
    </DashboardFullBleedPanel>
  )
}
