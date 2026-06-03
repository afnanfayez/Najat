'use client'

import type { AdminAidDistributionPoint } from '@/schemas/adminAid'
import { ADMIN_AID_BLUE, ADMIN_AID_FONT } from './adminAidStyles'
import AdminAidDistributionCard from './AdminAidDistributionCard'

interface AdminAidDistributionGridProps {
  points: AdminAidDistributionPoint[]
  onAdd?: () => void
  onDetails?: (point: AdminAidDistributionPoint) => void
}

export default function AdminAidDistributionGrid({
  points,
  onAdd,
  onDetails,
}: AdminAidDistributionGridProps) {
  return (
    <section dir="rtl">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2
          className="text-right text-base font-bold text-[#1E293B] sm:text-lg"
          style={{ fontFamily: ADMIN_AID_FONT }}
        >
          نقاط التوزيع
        </h2>
        <button
          type="button"
          onClick={onAdd}
          className="w-full rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 sm:w-auto sm:py-2 sm:text-sm"
          style={{ background: ADMIN_AID_BLUE, fontFamily: ADMIN_AID_FONT }}
        >
          + إضافة نقطة توزيع
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {points.map((point) => (
          <AdminAidDistributionCard
            key={point.id}
            point={point}
            onDetails={onDetails}
          />
        ))}
      </div>
    </section>
  )
}
