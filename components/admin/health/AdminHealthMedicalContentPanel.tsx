'use client'

import type { AdminHealthMedicalContent } from '@/schemas/adminHealth'
import AdminHealthContentRow from './AdminHealthContentRow'
import { ADMIN_HEALTH_FONT, ADMIN_HEALTH_CARD_SHADOW } from './adminHealthStyles'

interface AdminHealthMedicalContentPanelProps {
  items: AdminHealthMedicalContent[]
  onItemClick?: (item: AdminHealthMedicalContent) => void
}

export default function AdminHealthMedicalContentPanel({
  items,
  onItemClick,
}: AdminHealthMedicalContentPanelProps) {
  return (
    <div
      dir="rtl"
      className="rounded-2xl border border-[#E8EEF5] bg-white p-4 sm:p-5"
      style={{ boxShadow: ADMIN_HEALTH_CARD_SHADOW }}
    >
      <h2
        className="mb-5 text-xl font-bold text-[#1a2d4a] sm:text-2xl"
        style={{ fontFamily: ADMIN_HEALTH_FONT, lineHeight: 1.3 }}
      >
        إدارة المحتوى الطبي
      </h2>

      {items.length === 0 ? (
        <p
          className="py-8 text-center text-sm text-[#64748B]"
          style={{ fontFamily: ADMIN_HEALTH_FONT }}
        >
          لا يوجد محتوى مطابق للبحث.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <AdminHealthContentRow
              key={item.id}
              item={item}
              onClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}
