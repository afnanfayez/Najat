'use client'

import type { AdminReportsOperationsData } from '@/schemas/adminReports'
import {
  ADMIN_REPORTS_MAIN_COL,
  ADMIN_REPORTS_SIDE_COL,
  ADMIN_REPORTS_SPLIT_GRID,
} from '../adminReportsStyles'
import AdminReportsResourceDonutCard from '../AdminReportsResourceDonutCard'
import AdminReportsOperationsStatsRow from './AdminReportsOperationsStatsRow'
import AdminReportsActiveRegionsCard from './AdminReportsActiveRegionsCard'
import AdminReportsDataQualityCard from './AdminReportsDataQualityCard'

interface AdminReportsOperationsViewProps {
  dashboard: AdminReportsOperationsData
  onOpenMap?: () => void
}

export default function AdminReportsOperationsView({
  dashboard,
  onOpenMap,
}: AdminReportsOperationsViewProps) {
  return (
    <div dir="rtl" className="min-w-0">
      <AdminReportsOperationsStatsRow kpis={dashboard.kpis} />

      <div className={`${ADMIN_REPORTS_SPLIT_GRID} mb-3 sm:mb-4`}>
        <div className={`${ADMIN_REPORTS_MAIN_COL} order-1`}>
          <AdminReportsActiveRegionsCard
            data={dashboard.activeRegions}
            onOpenMap={onOpenMap}
          />
        </div>
        <div className={`${ADMIN_REPORTS_SIDE_COL} order-2`}>
          <AdminReportsResourceDonutCard
            data={dashboard.activityBreakdown}
            layout="vertical"
          />
        </div>
      </div>

      <AdminReportsDataQualityCard data={dashboard.dataQuality} />
    </div>
  )
}
