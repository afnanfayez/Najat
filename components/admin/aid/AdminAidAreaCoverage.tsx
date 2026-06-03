'use client'

import type { AdminAidAreaCoverage } from '@/schemas/adminAid'
import {
  ADMIN_AID_BLUE,
  ADMIN_AID_CARD_SHADOW,
  ADMIN_AID_FONT,
} from './adminAidStyles'

function formatNumber(value: number): string {
  return value.toLocaleString('en-US')
}

interface AdminAidAreaCoverageProps {
  areas: AdminAidAreaCoverage[]
  onViewMap?: () => void
}

export default function AdminAidAreaCoverage({
  areas,
  onViewMap,
}: AdminAidAreaCoverageProps) {
  return (
    <div
      className="flex h-full flex-col rounded-2xl border border-[#E8EEF5] bg-white p-5"
      style={{ boxShadow: ADMIN_AID_CARD_SHADOW }}
      dir="rtl"
    >
      <h2
        className="mb-4 text-right text-base font-bold text-[#1E293B] sm:text-lg"
        style={{ fontFamily: ADMIN_AID_FONT }}
      >
        تغطية المناطق
      </h2>

      <ul className="mb-5 flex-1 space-y-3">
        {areas.map((area) => (
          <li key={area.id} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ background: area.color }}
              />
              <span
                className="text-sm font-medium text-[#64748B]"
                style={{ fontFamily: ADMIN_AID_FONT }}
              >
                {area.label}
              </span>
            </div>
            <span
              className="text-sm font-bold text-[#1E293B]"
              style={{ fontFamily: ADMIN_AID_FONT }}
            >
              {formatNumber(area.value)}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onViewMap}
        className="w-full rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
        style={{ background: ADMIN_AID_BLUE, fontFamily: ADMIN_AID_FONT }}
      >
        عرض الخريطة التفاعلية
      </button>
    </div>
  )
}
