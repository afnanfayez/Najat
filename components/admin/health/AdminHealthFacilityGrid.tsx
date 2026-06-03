'use client'

import type { AdminHealthFacility } from '@/schemas/adminHealth'
import AdminHealthFacilityCard from './AdminHealthFacilityCard'
import { ADMIN_HEALTH_FONT } from './adminHealthStyles'

interface AdminHealthFacilityGridProps {
  facilities: AdminHealthFacility[]
  deletingId?: string | null
  onDetails?: (facility: AdminHealthFacility) => void
  onEdit?: (facility: AdminHealthFacility) => void
  onDelete?: (facility: AdminHealthFacility) => void
  onCall?: (facility: AdminHealthFacility) => void
}

export default function AdminHealthFacilityGrid({
  facilities,
  deletingId = null,
  onDetails,
  onEdit,
  onDelete,
  onCall,
}: AdminHealthFacilityGridProps) {
  if (facilities.length === 0) {
    return (
      <p
        className="py-12 text-center text-sm text-[#64748B]"
        style={{ fontFamily: ADMIN_HEALTH_FONT }}
      >
        لا توجد منشآت مطابقة للبحث.
      </p>
    )
  }

  return (
    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
      {facilities.map((facility) => (
        <AdminHealthFacilityCard
          key={facility.id}
          facility={facility}
          isDeleting={deletingId === facility.id}
          onDetails={onDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onCall={onCall}
        />
      ))}
    </section>
  )
}
