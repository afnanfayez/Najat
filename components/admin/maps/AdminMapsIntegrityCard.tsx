'use client'

import type { AdminMapsIntegrity } from '@/schemas/adminMaps'
import { ADMIN_MAPS_CARD_SHADOW, ADMIN_MAPS_FONT } from './adminMapsStyles'
import MapsPackageIntegrityStrip from './MapsPackageIntegrityStrip'

interface AdminMapsIntegrityCardProps {
  integrity: AdminMapsIntegrity
}

export default function AdminMapsIntegrityCard({
  integrity,
}: AdminMapsIntegrityCardProps) {
  return (
    <div
      className="flex h-full min-h-[220px] items-center rounded-2xl border border-[#E8EEF5] bg-white p-4 sm:min-h-[240px] sm:p-6"
      style={{ boxShadow: ADMIN_MAPS_CARD_SHADOW }}
      dir="rtl"
    >
      <MapsPackageIntegrityStrip integrity={integrity} className="w-full bg-transparent p-0" />
    </div>
  )
}
