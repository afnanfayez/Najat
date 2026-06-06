'use client'

import { ADMIN_USER_REGION_OPTIONS } from '@/lib/mocks/adminUsersMockData'
import type {
  AdminAuditPriorityFilter,
  AdminAuditRegionFilter,
} from '@/schemas/adminAudit'
import {
  ADMIN_AUDIT_CARD_SHADOW,
  ADMIN_AUDIT_CARD_SHELL,
} from './adminAuditStyles'
import AdminAuditSelectField from './AdminAuditSelectField'

interface AdminAuditFiltersBarProps {
  priority: AdminAuditPriorityFilter
  region: AdminAuditRegionFilter
  onPriorityChange: (value: AdminAuditPriorityFilter) => void
  onRegionChange: (value: AdminAuditRegionFilter) => void
}

const PRIORITY_OPTIONS: { value: AdminAuditPriorityFilter; label: string }[] = [
  { value: 'all', label: 'الكل' },
  { value: 'urgent', label: 'عاجل' },
  { value: 'normal', label: 'عادي' },
]

const regionOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'الكل' },
  ...ADMIN_USER_REGION_OPTIONS.map((option) => ({
    value: option,
    label: option,
  })),
]

export default function AdminAuditFiltersBar({
  priority,
  region,
  onPriorityChange,
  onRegionChange,
}: AdminAuditFiltersBarProps) {
  return (
    <section
      className={ADMIN_AUDIT_CARD_SHELL}
      style={{ boxShadow: ADMIN_AUDIT_CARD_SHADOW }}
      dir="rtl"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <AdminAuditSelectField
          label="الأولوية"
          value={priority}
          onValueChange={(v) => onPriorityChange(v as AdminAuditPriorityFilter)}
          options={PRIORITY_OPTIONS}
        />
        <AdminAuditSelectField
          label="المناطق"
          value={region}
          onValueChange={(v) => onRegionChange(v as AdminAuditRegionFilter)}
          options={regionOptions}
        />
      </div>
    </section>
  )
}
