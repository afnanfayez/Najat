import DashboardFullBleedPanel from '@/components/dashboard/DashboardFullBleedPanel'
import HealthServicesPage from '@/components/health/HealthServicesPage'

export default function HospitalsPage() {
  return (
    <DashboardFullBleedPanel>
      <HealthServicesPage category="hospitals" />
    </DashboardFullBleedPanel>
  )
}
