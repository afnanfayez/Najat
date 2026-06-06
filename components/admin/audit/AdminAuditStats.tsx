'use client'

import { FileText, Flame, Star, TrendingUp } from 'lucide-react'
import type { AdminAuditStats } from '@/schemas/adminAudit'
import {
  ADMIN_AUDIT_BLUE,
  ADMIN_AUDIT_CARD_SHADOW,
  ADMIN_AUDIT_FONT,
  formatAuditPoints,
} from './adminAuditStyles'

interface AdminAuditStatsProps {
  stats: AdminAuditStats
}

const STAT_ITEMS = [
  { key: 'totalReports' as const, label: 'إجمالي البلاغات', icon: FileText },
  { key: 'resolvedWeekly' as const, label: 'تم حلها أسبوعياً', icon: TrendingUp },
  { key: 'pendingUrgent' as const, label: 'بلاغات عاجلة معلقة', icon: Flame },
  { key: 'pointsSpent' as const, label: 'النقاط المصروفة', icon: Star, format: formatAuditPoints },
]

export default function AdminAuditStats({ stats }: AdminAuditStatsProps) {
  return (
    <section
      className="mb-4 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:mb-6 sm:gap-3 md:gap-4 xl:grid-cols-4"
      dir="rtl"
    >
      {STAT_ITEMS.map((item) => {
        const Icon = item.icon
        const raw = stats[item.key]
        const display = item.format ? item.format(raw) : raw.toLocaleString('en-US')

        return (
          <div
            key={item.key}
            className="rounded-xl bg-white px-4 py-4 sm:px-5 sm:py-5"
            style={{ boxShadow: ADMIN_AUDIT_CARD_SHADOW }}
          >
            <div className="flex w-full flex-col items-start text-right">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Icon size={20} style={{ color: ADMIN_AUDIT_BLUE }} strokeWidth={2.5} />
                <p
                  className="text-xs font-bold text-[#0F172A] sm:text-sm md:text-base"
                  style={{ fontFamily: ADMIN_AUDIT_FONT }}
                >
                  {item.label}
                </p>
              </div>
              <p
                className="mt-2 self-start text-2xl font-bold leading-none sm:mt-3 sm:text-[32px]"
                style={{ color: ADMIN_AUDIT_BLUE, fontFamily: ADMIN_AUDIT_FONT }}
              >
                {display}
              </p>
            </div>
          </div>
        )
      })}
    </section>
  )
}
