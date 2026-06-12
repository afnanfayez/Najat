'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import AdminUsersSelectField from '../users/AdminUsersSelectField'
import {
  ADMIN_HEALTH_REGION_OPTIONS,
  ADMIN_HEALTH_STATUS_OPTIONS,
  ADMIN_HEALTH_TYPE_OPTIONS,
} from '@/lib/mocks/adminHealthMockData'
import type {
  AdminHealthFacilityTypeFilter,
  AdminHealthRegionFilter,
  AdminHealthStatusFilter,
} from '@/schemas/adminHealth'
import {
  ADMIN_HEALTH_BLUE,
  ADMIN_HEALTH_FONT,
  ADMIN_HEALTH_INPUT_BG,
  ADMIN_HEALTH_LABEL_STYLE,
  ADMIN_HEALTH_CARD_SHADOW,
} from './adminHealthStyles'

interface AdminHealthFiltersProps {
  search: string
  region: AdminHealthRegionFilter
  status: AdminHealthStatusFilter
  facilityType?: AdminHealthFacilityTypeFilter
  mode?: 'facilities' | 'content'
  onSearchChange: (value: string) => void
  onRegionChange: (value: AdminHealthRegionFilter) => void
  onStatusChange: (value: AdminHealthStatusFilter) => void
  onFacilityTypeChange?: (value: AdminHealthFacilityTypeFilter) => void
}

export default function AdminHealthFilters({
  search,
  region,
  status,
  facilityType = 'all',
  mode = 'facilities',
  onSearchChange,
  onRegionChange,
  onStatusChange,
  onFacilityTypeChange,
}: AdminHealthFiltersProps) {
  return (
    <div
      className="rounded-2xl border border-[#E8EEF5] bg-white p-4 sm:p-5"
      style={{ boxShadow: ADMIN_HEALTH_CARD_SHADOW }}
    >
      <div
        className={`grid grid-cols-1 gap-4 ${mode === 'facilities' ? 'sm:grid-cols-2 lg:grid-cols-4' : ''}`}
      >
        <div className="flex flex-col gap-2 text-right">
          <label style={ADMIN_HEALTH_LABEL_STYLE}>
            {mode === 'content' ? 'البحث في المحتوى' : 'البحث'}
          </label>
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
              style={{ color: ADMIN_HEALTH_BLUE }}
            />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                mode === 'content'
                  ? 'ابحث عن مقال أو موضوع'
                  : 'ابحث عن مستشفى أو عيادة'
              }
              autoComplete="off"
              className="h-11 border-none pr-10 text-right text-sm shadow-none focus-visible:ring-0"
              style={{
                fontFamily: ADMIN_HEALTH_FONT,
                background: ADMIN_HEALTH_INPUT_BG,
                color: '#334155',
              }}
            />
          </div>
        </div>

        {mode === 'facilities' && (
          <>
            <AdminUsersSelectField
              label="نوع المنشأة"
              value={facilityType}
              onValueChange={(value) =>
                onFacilityTypeChange?.(value as AdminHealthFacilityTypeFilter)
              }
              options={[...ADMIN_HEALTH_TYPE_OPTIONS]}
            />

            <AdminUsersSelectField
              label="المناطق"
              value={region}
              onValueChange={(value) =>
                onRegionChange(value as AdminHealthRegionFilter)
              }
              options={[...ADMIN_HEALTH_REGION_OPTIONS]}
            />

            <AdminUsersSelectField
              label="الحالة"
              value={status}
              onValueChange={(value) =>
                onStatusChange(value as AdminHealthStatusFilter)
              }
              options={[...ADMIN_HEALTH_STATUS_OPTIONS]}
            />
          </>
        )}
      </div>
    </div>
  )
}
