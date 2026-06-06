'use client'

import type { AdminReportsActiveRegions } from '@/schemas/adminReports'
import {
  ADMIN_REPORTS_BLUE,
  ADMIN_REPORTS_CARD_SHELL,
  ADMIN_REPORTS_CARD_SHADOW,
  ADMIN_REPORTS_FONT,
  ADMIN_REPORTS_INPUT_BG,
} from '../adminReportsStyles'

interface AdminReportsActiveRegionsCardProps {
  data: AdminReportsActiveRegions
  onOpenMap?: () => void
}

export default function AdminReportsActiveRegionsCard({
  data,
  onOpenMap,
}: AdminReportsActiveRegionsCardProps) {
  return (
    <section
      className={`${ADMIN_REPORTS_CARD_SHELL} h-full`}
      style={{ boxShadow: ADMIN_REPORTS_CARD_SHADOW, fontFamily: ADMIN_REPORTS_FONT }}
      dir="rtl"
    >
      <div className="mb-4 flex flex-col gap-2 min-[480px]:flex-row min-[480px]:items-start min-[480px]:justify-between">
        <div className="min-w-0 text-right">
          <h3 className="text-sm font-bold text-[#0F172A] sm:text-base">{data.title}</h3>
          <p className="mt-0.5 text-[11px] font-medium text-[#94A3B8] sm:text-xs">
            {data.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenMap}
          className="shrink-0 self-start rounded-lg px-3 py-1.5 text-xs font-bold sm:text-sm"
          style={{
            background: ADMIN_REPORTS_INPUT_BG,
            color: ADMIN_REPORTS_BLUE,
            fontFamily: ADMIN_REPORTS_FONT,
          }}
        >
          {data.mapActionLabel}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {data.regions.map((region) => (
          <div key={region.id}>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#0F172A] sm:text-sm">{region.name}</span>
              <span
                className="text-xs font-bold sm:text-sm"
                style={{ color: ADMIN_REPORTS_BLUE }}
              >
                {region.percent}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#E2E8F0]" dir="rtl">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${region.percent}%`, background: ADMIN_REPORTS_BLUE }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
