'use client'

import AdminHealthFilters from './AdminHealthFilters'
import AdminHealthActionButton from './AdminHealthActionButton'
import type {
  AdminHealthFacilityTypeFilter,
  AdminHealthRegionFilter,
  AdminHealthStatusFilter,
} from '@/schemas/adminHealth'

interface AdminHealthToolbarProps {
  search: string
  region: AdminHealthRegionFilter
  status: AdminHealthStatusFilter
  facilityType?: AdminHealthFacilityTypeFilter
  mode?: 'facilities' | 'content'
  actionLabel: string
  onSearchChange: (value: string) => void
  onRegionChange: (value: AdminHealthRegionFilter) => void
  onStatusChange: (value: AdminHealthStatusFilter) => void
  onFacilityTypeChange?: (value: AdminHealthFacilityTypeFilter) => void
  onAction?: () => void
}

export default function AdminHealthToolbar({
  search,
  region,
  status,
  facilityType = 'all',
  mode = 'facilities',
  actionLabel,
  onSearchChange,
  onRegionChange,
  onStatusChange,
  onFacilityTypeChange,
  onAction,
}: AdminHealthToolbarProps) {
  return (
    <div dir="rtl" className="mb-6 flex flex-col gap-4">
      <AdminHealthFilters
        mode={mode}
        search={search}
        region={region}
        status={status}
        facilityType={facilityType}
        onSearchChange={onSearchChange}
        onRegionChange={onRegionChange}
        onStatusChange={onStatusChange}
        onFacilityTypeChange={onFacilityTypeChange}
      />

      <div className="flex w-full justify-stretch sm:justify-end">
        <AdminHealthActionButton label={actionLabel} onClick={onAction} />
      </div>
    </div>
  )
}
