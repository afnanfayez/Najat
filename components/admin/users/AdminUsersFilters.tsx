'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  ADMIN_USER_REGION_OPTIONS,
  ADMIN_USER_ROLE_OPTIONS,
} from '@/lib/mocks/adminUsersMockData'
import type { AdminUserRegionFilter, AdminUserRoleFilter } from '@/schemas/adminUser'
import AdminUsersSelectField from './AdminUsersSelectField'
import {
  ADMIN_USERS_BLUE,
  ADMIN_USERS_FONT,
  ADMIN_USERS_INPUT_BG,
  ADMIN_USERS_LABEL_STYLE,
} from './adminUsersStyles'

interface AdminUsersFiltersProps {
  search: string
  role: AdminUserRoleFilter
  region: AdminUserRegionFilter
  onSearchChange: (value: string) => void
  onRoleChange: (value: AdminUserRoleFilter) => void
  onRegionChange: (value: AdminUserRegionFilter) => void
}

const roleOptions = [
  { value: 'all', label: 'الكل' },
  ...ADMIN_USER_ROLE_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
  })),
]

const regionOptions = [
  { value: 'all', label: 'الكل' },
  ...ADMIN_USER_REGION_OPTIONS.map((option) => ({
    value: option,
    label: option,
  })),
]

export default function AdminUsersFilters({
  search,
  role,
  region,
  onSearchChange,
  onRoleChange,
  onRegionChange,
}: AdminUsersFiltersProps) {
  return (
    <div className="mb-6 rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2 text-right">
          <label style={ADMIN_USERS_LABEL_STYLE}>البحث بالاسم أو البريد الإلكتروني</label>
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
              style={{ color: ADMIN_USERS_BLUE }}
            />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="البحث بالاسم أو البريد الإلكتروني..."
              className="h-11 border-none pr-10 text-right text-sm shadow-none focus-visible:ring-0"
              style={{
                fontFamily: ADMIN_USERS_FONT,
                background: ADMIN_USERS_INPUT_BG,
                color: '#334155',
              }}
            />
          </div>
        </div>

        <AdminUsersSelectField
          label="الأدوار"
          value={role}
          onValueChange={(value) => onRoleChange(value as AdminUserRoleFilter)}
          options={roleOptions}
        />

        <AdminUsersSelectField
          label="المناطق"
          value={region}
          onValueChange={(value) => onRegionChange(value as AdminUserRegionFilter)}
          options={regionOptions}
        />
      </div>
    </div>
  )
}
