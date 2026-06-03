'use client'

import AdminHealthFilters from './AdminHealthFilters'
import AdminHealthActionButton from './AdminHealthActionButton'
import type {
  AdminHealthRegionFilter,
  AdminHealthStatusFilter,
} from '@/schemas/adminHealth'

interface AdminHealthToolbarProps {
  search: string
  region: AdminHealthRegionFilter
  status: AdminHealthStatusFilter
  mode?: 'facilities' | 'content'
  actionLabel: string
  onSearchChange: (value: string) => void
  onRegionChange: (value: AdminHealthRegionFilter) => void
  onStatusChange: (value: AdminHealthStatusFilter) => void
  onAction?: () => void
}

export default function AdminHealthToolbar({
  search,
  region,
  status,
  mode = 'facilities',
  actionLabel,
  onSearchChange,
  onRegionChange,
  onStatusChange,
  onAction,
}: AdminHealthToolbarProps) {
  return (
    <div dir="rtl" className="mb-6 flex flex-col gap-4">
      <AdminHealthFilters
        mode={mode}
        search={search}
        region={region}
        status={status}
        onSearchChange={onSearchChange}
        onRegionChange={onRegionChange}
        onStatusChange={onStatusChange}
      />

      <div className="flex w-full justify-stretch sm:justify-end">
        <AdminHealthActionButton label={actionLabel} onClick={onAction} />
      </div>
    </div>
  )
}
