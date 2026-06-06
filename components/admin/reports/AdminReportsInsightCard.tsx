'use client'

import type { AdminReportsInsight } from '@/schemas/adminReports'
import { ADMIN_REPORTS_FONT } from './adminReportsStyles'

interface AdminReportsInsightCardProps {
  insight: AdminReportsInsight
  onViewDetails?: () => void
}

export default function AdminReportsInsightCard({
  insight,
  onViewDetails,
}: AdminReportsInsightCardProps) {
  return (
    <aside
      className="flex h-full flex-col rounded-xl p-4 sm:p-5"
      style={{
        fontFamily: ADMIN_REPORTS_FONT,
        background: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)',
        boxShadow: '0 2px 12px rgba(33,150,243,0.25)',
      }}
      dir="rtl"
    >
      <h3 className="mb-3 text-right text-sm font-bold text-white sm:text-base">
        {insight.title}
      </h3>

      <p className="flex-1 text-right text-xs leading-7 text-white/95 sm:text-sm sm:leading-8">
        {insight.body}
      </p>

      <button
        type="button"
        onClick={onViewDetails}
        className="mt-4 w-full rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#2196F3] transition-opacity hover:opacity-90 sm:text-sm"
        style={{ fontFamily: ADMIN_REPORTS_FONT }}
      >
        {insight.actionLabel}
      </button>
    </aside>
  )
}
