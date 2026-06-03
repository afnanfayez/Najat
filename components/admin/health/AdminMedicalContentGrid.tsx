'use client'

import type { AdminHealthMedicalContent } from '@/schemas/adminHealth'
import AdminMedicalContentCard from './AdminMedicalContentCard'
import { ADMIN_HEALTH_FONT } from './adminHealthStyles'

interface AdminMedicalContentGridProps {
  items: AdminHealthMedicalContent[]
  deletingId?: string | null
  onOpen?: (item: AdminHealthMedicalContent) => void
  onEdit?: (item: AdminHealthMedicalContent) => void
  onDelete?: (item: AdminHealthMedicalContent) => void
}

export default function AdminMedicalContentGrid({
  items,
  deletingId = null,
  onOpen,
  onEdit,
  onDelete,
}: AdminMedicalContentGridProps) {
  if (items.length === 0) {
    return (
      <p
        className="py-16 text-center text-sm text-[#64748B]"
        style={{ fontFamily: ADMIN_HEALTH_FONT }}
      >
        لا يوجد محتوى في هذا التصنيف حالياً.
      </p>
    )
  }

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
      {items.map((item) => (
        <AdminMedicalContentCard
          key={item.id}
          item={item}
          isDeleting={deletingId === item.id}
          onOpen={onOpen}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  )
}
