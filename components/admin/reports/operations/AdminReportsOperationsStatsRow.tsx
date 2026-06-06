'use client'

import type { AdminReportsKpi } from '@/schemas/adminReports'
import {
  ADMIN_REPORTS_BLUE,
  ADMIN_REPORTS_CARD_SHADOW,
  ADMIN_REPORTS_FONT,
} from '../adminReportsStyles'

interface AdminReportsOperationsStatsRowProps {
  kpis: AdminReportsKpi[]
}

export default function AdminReportsOperationsStatsRow({
  kpis,
}: AdminReportsOperationsStatsRowProps) {
  return (
    <section
      className="mb-4 grid min-w-0 grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:mb-6 md:grid-cols-3 lg:grid-cols-5 sm:gap-4"
      dir="rtl"
    >
      {kpis.map((kpi) => (
        <article
          key={kpi.id}
          className="min-w-0 rounded-xl border border-[#E8EEF5] bg-white px-4 py-4 sm:px-5 sm:py-5"
          style={{ boxShadow: ADMIN_REPORTS_CARD_SHADOW, fontFamily: ADMIN_REPORTS_FONT }}
        >
          <p className="mb-2 text-right text-xs font-bold text-[#0F172A] sm:text-sm">
            {kpi.label}
          </p>
          <p
            className="text-right text-xl font-bold leading-none sm:text-2xl"
            style={{ color: ADMIN_REPORTS_BLUE }}
          >
            {kpi.value}
          </p>
        </article>
      ))}
    </section>
  )
}
