'use client'

import type { AdminSecurityKpi } from '@/schemas/adminSecurity'
import {
  ADMIN_SECURITY_BLUE,
  ADMIN_SECURITY_CARD_SHADOW,
  ADMIN_SECURITY_FONT,
} from '../adminSecurityStyles'

interface AdminSecurityBackupStatsRowProps {
  kpis: AdminSecurityKpi[]
}

export default function AdminSecurityBackupStatsRow({ kpis }: AdminSecurityBackupStatsRowProps) {
  return (
    <section
      className="mb-4 grid min-w-0 grid-cols-1 gap-3 min-[480px]:grid-cols-3 sm:mb-6 sm:gap-4"
      dir="rtl"
    >
      {kpis.map((kpi) => (
        <article
          key={kpi.id}
          className="min-w-0 rounded-xl border border-[#E8EEF5] bg-white px-4 py-4 sm:px-5 sm:py-5"
          style={{ boxShadow: ADMIN_SECURITY_CARD_SHADOW, fontFamily: ADMIN_SECURITY_FONT }}
        >
          <p className="mb-2 min-w-0 break-words text-right text-xs font-bold text-[#0F172A] sm:text-sm">
            {kpi.label}
          </p>
          <p
            className="break-words text-right text-lg font-bold leading-none sm:text-xl lg:text-2xl"
            style={{ color: ADMIN_SECURITY_BLUE }}
          >
            {kpi.value}
          </p>
        </article>
      ))}
    </section>
  )
}
