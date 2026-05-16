import DashboardFullBleedPanel from '@/components/dashboard/DashboardFullBleedPanel'
import HumanitarianAidPage from '@/components/aid/HumanitarianAidPage'

export default async function HumanitarianAidDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <DashboardFullBleedPanel>
      <HumanitarianAidPage aidId={id} />
    </DashboardFullBleedPanel>
  )
}
