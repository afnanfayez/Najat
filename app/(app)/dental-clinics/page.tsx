import DashboardFullBleedPanel from '@/components/dashboard/DashboardFullBleedPanel'
import HealthServicesPage from '@/components/health/HealthServicesPage'

export default function DentalClinicsPage() {
  return (
    <DashboardFullBleedPanel>
      <HealthServicesPage category="dental" />
    </DashboardFullBleedPanel>
  )
}
