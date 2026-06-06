'use client'

import type { AdminReportsStatisticalData } from '@/schemas/adminReports'
import { ADMIN_REPORTS_SPLIT_GRID } from './adminReportsStyles'
import AdminReportsStatsRow from './AdminReportsStatsRow'
import AdminReportsRegionalChartCard from './AdminReportsRegionalChartCard'
import AdminReportsResourceDonutCard from './AdminReportsResourceDonutCard'
import AdminReportsResponseTimeCard from './AdminReportsResponseTimeCard'
import AdminReportsNeedyRegionsCard from './AdminReportsNeedyRegionsCard'
import AdminReportsInsightCard from './AdminReportsInsightCard'

interface AdminReportsStatisticalViewProps {
  dashboard: AdminReportsStatisticalData
  onViewRegionalDetails?: () => void
}

export default function AdminReportsStatisticalView({
  dashboard,
  onViewRegionalDetails,
}: AdminReportsStatisticalViewProps) {
  return (
    <div dir="rtl">
      <AdminReportsStatsRow kpis={dashboard.kpis} />

      <div className={`${ADMIN_REPORTS_SPLIT_GRID} mb-3 sm:mb-4`}>
        <div className="lg:col-span-8">
          <AdminReportsRegionalChartCard data={dashboard.regionalDistribution} />
        </div>
        <div className="lg:col-span-4">
          <AdminReportsResourceDonutCard data={dashboard.resourceBreakdown} />
        </div>
      </div>

      <div className="mb-3 sm:mb-4">
        <AdminReportsResponseTimeCard data={dashboard.responseTime} />
      </div>

      <div className={ADMIN_REPORTS_SPLIT_GRID}>
        <div className="lg:col-span-7">
          <AdminReportsInsightCard
            insight={dashboard.insight}
            onViewDetails={onViewRegionalDetails}
          />
        </div>
        <div className="lg:col-span-5">
          <AdminReportsNeedyRegionsCard data={dashboard.needyRegions} />
        </div>
      </div>
    </div>
  )
}
