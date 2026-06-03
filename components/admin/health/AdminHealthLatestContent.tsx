'use client'

import { ExternalLink } from 'lucide-react'
import type { AdminHealthMedicalContent } from '@/schemas/adminHealth'
import AdminHealthContentRow from './AdminHealthContentRow'
import { ADMIN_HEALTH_BLUE, ADMIN_HEALTH_FONT } from './adminHealthStyles'

interface AdminHealthLatestContentProps {
  items: AdminHealthMedicalContent[]
  onManageAll?: () => void
  onItemClick?: (item: AdminHealthMedicalContent) => void
}

export default function AdminHealthLatestContent({
  items,
  onManageAll,
  onItemClick,
}: AdminHealthLatestContentProps) {
  return (
    <section
      dir="rtl"
      className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-5"
    >
      <div className="mb-5 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h2
          className="text-lg font-bold text-[#1a2d4a] sm:text-xl lg:text-2xl"
          style={{ fontFamily: ADMIN_HEALTH_FONT, lineHeight: 1.3 }}
        >
          أحدث المحتوى الطبي
        </h2>
        <button
          type="button"
          onClick={onManageAll}
          className="flex w-full items-center justify-center gap-2 text-sm font-bold transition-opacity hover:opacity-80 sm:w-auto sm:text-base lg:text-lg"
          style={{ color: ADMIN_HEALTH_BLUE, fontFamily: ADMIN_HEALTH_FONT }}
        >
          <ExternalLink size={20} strokeWidth={2.5} />
          <span>إدارة كل المحتوى</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <AdminHealthContentRow
            key={item.id}
            item={item}
            onClick={onItemClick}
          />
        ))}
      </div>
    </section>
  )
}
