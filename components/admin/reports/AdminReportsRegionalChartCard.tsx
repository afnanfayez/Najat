'use client'

import type { AdminReportsRegionalDistribution } from '@/schemas/adminReports'
import {
  ADMIN_REPORTS_CARD_SHELL,
  ADMIN_REPORTS_CARD_SHADOW,
  ADMIN_REPORTS_FONT,
} from './adminReportsStyles'
import AdminReportsLineChart from './AdminReportsLineChart'

interface AdminReportsRegionalChartCardProps {
  data: AdminReportsRegionalDistribution
}

export default function AdminReportsRegionalChartCard({
  data,
}: AdminReportsRegionalChartCardProps) {
  return (
    <section
      className={`${ADMIN_REPORTS_CARD_SHELL} h-full`}
      style={{ boxShadow: ADMIN_REPORTS_CARD_SHADOW, fontFamily: ADMIN_REPORTS_FONT }}
      dir="rtl"
    >
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 text-right">
          <h3 className="text-sm font-bold text-[#0F172A] sm:text-base">{data.title}</h3>
          <p className="mt-0.5 text-[11px] font-medium text-[#94A3B8] sm:text-xs">
            {data.subtitle}
          </p>
        </div>
        <span
          className="self-start rounded-full px-2.5 py-0.5 text-[10px] font-bold sm:text-[11px]"
          style={{ background: '#FFF3E0', color: '#F97316' }}
        >
          {data.periodTag}
        </span>
      </div>

      <AdminReportsLineChart
        labels={data.points.map((p) => p.region)}
        values={data.points.map((p) => p.value)}
        ariaLabel={data.title}
      />
    </section>
  )
}
