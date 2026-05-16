import DashboardFullBleedPanel from '@/components/dashboard/DashboardFullBleedPanel'
import HealthServicesPage from '@/components/health/HealthServicesPage'

export default function PharmaciesPage() {
  return (
    <DashboardFullBleedPanel>
      <HealthServicesPage category="pharmacies" />
    </DashboardFullBleedPanel>
  )
}
