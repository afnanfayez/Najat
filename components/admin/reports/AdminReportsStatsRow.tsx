'use client'

import type { AdminReportsKpi } from '@/schemas/adminReports'
import {
  ADMIN_REPORTS_BLUE,
  ADMIN_REPORTS_CARD_SHADOW,
  ADMIN_REPORTS_FONT,
  ADMIN_REPORTS_INPUT_BG,
} from './adminReportsStyles'

interface AdminReportsStatsRowProps {
  kpis: AdminReportsKpi[]
}

export default function AdminReportsStatsRow({ kpis }: AdminReportsStatsRowProps) {
  return (
    <section
      className="mb-4 grid min-w-0 grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:mb-6 lg:grid-cols-4 sm:gap-4"
      dir="rtl"
    >
      {kpis.map((kpi) => (
        <article
          key={kpi.id}
          className="min-w-0 rounded-xl border border-[#E8EEF5] bg-white px-4 py-4 sm:px-5 sm:py-5"
          style={{ boxShadow: ADMIN_REPORTS_CARD_SHADOW, fontFamily: ADMIN_REPORTS_FONT }}
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <p className="text-right text-xs font-bold text-[#0F172A] sm:text-sm">{kpi.label}</p>
            {kpi.tag && (
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold sm:text-[11px]"
                style={{ background: ADMIN_REPORTS_INPUT_BG, color: ADMIN_REPORTS_BLUE }}
              >
                {kpi.tag}
              </span>
            )}
          </div>
          <p
            className="text-right text-2xl font-bold leading-none sm:text-3xl"
            style={{ color: ADMIN_REPORTS_BLUE }}
          >
            {kpi.value}
          </p>
        </article>
      ))}
    </section>
  )
}
