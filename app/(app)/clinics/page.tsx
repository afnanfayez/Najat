import DashboardFullBleedPanel from '@/components/dashboard/DashboardFullBleedPanel'
import HealthServicesPage from '@/components/health/HealthServicesPage'

export default function ClinicsPage() {
  return (
    <DashboardFullBleedPanel>
      <HealthServicesPage category="clinics" />
    </DashboardFullBleedPanel>
  )
}
