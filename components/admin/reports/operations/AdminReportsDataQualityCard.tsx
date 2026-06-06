'use client'

import type { AdminReportsDataQuality } from '@/schemas/adminReports'
import {
  ADMIN_REPORTS_CARD_SHELL,
  ADMIN_REPORTS_CARD_SHADOW,
  ADMIN_REPORTS_FONT,
} from '../adminReportsStyles'
import AdminReportsCircularGauge from './AdminReportsCircularGauge'

interface AdminReportsDataQualityCardProps {
  data: AdminReportsDataQuality
}

export default function AdminReportsDataQualityCard({ data }: AdminReportsDataQualityCardProps) {
  return (
    <section
      className={ADMIN_REPORTS_CARD_SHELL}
      style={{ boxShadow: ADMIN_REPORTS_CARD_SHADOW, fontFamily: ADMIN_REPORTS_FONT }}
      dir="rtl"
    >
      <div className="mb-5 text-right">
        <h3 className="text-sm font-bold text-[#0F172A] sm:text-base">{data.title}</h3>
        <p className="mt-0.5 text-[11px] font-medium text-[#94A3B8] sm:text-xs">
          {data.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 sm:gap-6">
        {data.gauges.map((gauge) => (
          <div
            key={gauge.id}
            className="flex flex-col items-center gap-3 min-[560px]:flex-row min-[560px]:items-center min-[560px]:gap-4"
          >
            <AdminReportsCircularGauge
              value={gauge.value}
              color={gauge.color}
              trackColor={gauge.color === '#22C55E' ? '#E8F5E9' : '#E3F2FD'}
              size={88}
              className="sm:hidden"
            />
            <AdminReportsCircularGauge
              value={gauge.value}
              color={gauge.color}
              trackColor={gauge.color === '#22C55E' ? '#E8F5E9' : '#E3F2FD'}
              size={100}
              className="hidden sm:block"
            />
            <div className="min-w-0 flex-1 text-right">
              <h4 className="mb-1 text-sm font-bold text-[#0F172A] sm:text-base">
                {gauge.label}
              </h4>
              <p className="text-xs leading-relaxed text-[#64748B] sm:text-sm">
                {gauge.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
