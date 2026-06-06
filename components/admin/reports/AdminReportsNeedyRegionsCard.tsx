'use client'

import type { AdminReportsNeedyRegions } from '@/schemas/adminReports'
import {
  ADMIN_REPORTS_CARD_SHELL,
  ADMIN_REPORTS_CARD_SHADOW,
  ADMIN_REPORTS_FONT,
  ADMIN_REPORTS_NEED_LEVEL,
} from './adminReportsStyles'

interface AdminReportsNeedyRegionsCardProps {
  data: AdminReportsNeedyRegions
}

export default function AdminReportsNeedyRegionsCard({
  data,
}: AdminReportsNeedyRegionsCardProps) {
  return (
    <section
      className={`${ADMIN_REPORTS_CARD_SHELL} h-full`}
      style={{ boxShadow: ADMIN_REPORTS_CARD_SHADOW, fontFamily: ADMIN_REPORTS_FONT }}
      dir="rtl"
    >
      <h3 className="mb-4 text-sm font-bold text-[#0F172A] sm:text-base">{data.title}</h3>

      <div className="flex flex-col gap-4">
        {data.regions.map((region) => {
          const tone = ADMIN_REPORTS_NEED_LEVEL[region.levelTone]
          return (
            <div key={region.id}>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-xs font-bold text-[#0F172A] sm:text-sm">
                  {region.name}
                </span>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold sm:text-[11px]"
                  style={{ background: tone.bg, color: tone.text }}
                >
                  {region.level}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#E2E8F0]" dir="rtl">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${region.percent}%`, background: tone.bar }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
