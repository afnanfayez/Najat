'use client'

import type { AdminDataReviewDetail } from '@/schemas/adminData'
import {
  ADMIN_DATA_CARD_SHADOW,
  ADMIN_DATA_CARD_SHELL,
  ADMIN_DATA_FONT,
} from '../adminDataStyles'

interface AdminDataFacilityInfoCardProps {
  detail: AdminDataReviewDetail
}

export default function AdminDataFacilityInfoCard({
  detail,
}: AdminDataFacilityInfoCardProps) {
  const fields = [
    { label: 'اسم المنشأة', value: detail.facilityName },
    { label: 'النوع', value: detail.facilityType },
    { label: 'الموقع', value: detail.location },
    { label: 'آخر تحديث ميداني', value: detail.lastFieldUpdate },
  ]

  return (
    <article
      className={ADMIN_DATA_CARD_SHELL}
      style={{ boxShadow: ADMIN_DATA_CARD_SHADOW }}
      dir="rtl"
    >
      <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <h2
          className="text-base font-bold text-[#0F172A] sm:text-lg"
          style={{ fontFamily: ADMIN_DATA_FONT }}
        >
          معلومات المنشأة
        </h2>
        <span
          className="inline-flex w-fit shrink-0 items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-[11px] font-bold sm:px-3 sm:text-xs"
          style={{
            fontFamily: ADMIN_DATA_FONT,
            color: detail.isOpen ? '#4CAF50' : '#64748B',
            background: detail.isOpen ? '#E8F5E9' : '#F1F5F9',
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: detail.isOpen ? '#4CAF50' : '#94A3B8' }}
          />
          {detail.isOpen ? 'مفتوح الآن' : 'مغلق'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {fields.map((field) => (
          <div key={field.label} className="text-right">
            <p
              className="text-xs font-bold text-[#2196F3] sm:text-sm"
              style={{ fontFamily: ADMIN_DATA_FONT }}
            >
              {field.label}
            </p>
            <p
              className="mt-1 text-sm font-bold text-[#0F172A]"
              style={{ fontFamily: ADMIN_DATA_FONT }}
            >
              {field.value}
            </p>
          </div>
        ))}
      </div>
    </article>
  )
}
