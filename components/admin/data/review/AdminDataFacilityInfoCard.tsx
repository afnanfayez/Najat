'use client'

import type { AdminDataReviewDetail } from '@/schemas/adminData'
import {
  ADMIN_DATA_CARD_SHADOW,
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
      className="rounded-2xl border border-[#E8EEF5] bg-white p-4 sm:p-5"
      style={{ boxShadow: ADMIN_DATA_CARD_SHADOW }}
      dir="rtl"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2
          className="text-base font-bold text-[#0F172A] sm:text-lg"
          style={{ fontFamily: ADMIN_DATA_FONT }}
        >
          معلومات المنشأة
        </h2>
        <span
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
