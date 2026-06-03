'use client'

import { Clock } from 'lucide-react'
import type { AdminAidDistributionPoint, DistributionPointStatus } from '@/schemas/adminAid'
import { ADMIN_AID_BLUE, ADMIN_AID_FONT } from './adminAidStyles'

const STATUS_CONFIG: Record<
  DistributionPointStatus,
  { label: string; color: string; bg: string }
> = {
  open: { label: 'مفتوح', color: '#4CAF50', bg: '#E8F5E9' },
  crowded: { label: 'مزدحم', color: '#FF9800', bg: '#FFF3E0' },
  closed: { label: 'مغلق', color: '#9E9E9E', bg: '#F5F5F5' },
}

interface AdminAidDistributionCardProps {
  point: AdminAidDistributionPoint
  onDetails?: (point: AdminAidDistributionPoint) => void
}

export default function AdminAidDistributionCard({
  point,
  onDetails,
}: AdminAidDistributionCardProps) {
  const status = STATUS_CONFIG[point.status]
  const percent =
    point.total > 0 ? Math.round((point.remaining / point.total) * 100) : 0

  return (
    <article
      className="rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
      dir="rtl"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3
          className="text-right text-base font-bold sm:text-lg"
          style={{ color: ADMIN_AID_BLUE, fontFamily: ADMIN_AID_FONT }}
        >
          {point.name}
        </h3>
        <span
          className="shrink-0 rounded-full px-3 py-1 text-xs font-bold"
          style={{
            fontFamily: ADMIN_AID_FONT,
            color: status.color,
            background: status.bg,
          }}
        >
          {status.label}
        </span>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <span
          className="text-sm font-medium text-[#64748B]"
          style={{ fontFamily: ADMIN_AID_FONT }}
        >
          {point.category}
        </span>
        <span
          className="text-sm font-bold"
          style={{ color: ADMIN_AID_BLUE, fontFamily: ADMIN_AID_FONT }}
        >
          {point.remaining} متبقي
        </span>
      </div>

      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-[#E8EEF5]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percent}%`,
            background: ADMIN_AID_BLUE,
            marginRight: 0,
            marginLeft: 'auto',
          }}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[#94A3B8]">
          <Clock size={14} />
          <span className="text-xs font-medium" style={{ fontFamily: ADMIN_AID_FONT }}>
            آخر تحديث: {point.lastUpdated}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onDetails?.(point)}
          className="text-sm font-bold transition-opacity hover:opacity-80"
          style={{ color: ADMIN_AID_BLUE, fontFamily: ADMIN_AID_FONT }}
        >
          التفاصيل
        </button>
      </div>
    </article>
  )
}
