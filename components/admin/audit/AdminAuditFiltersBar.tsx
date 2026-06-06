'use client'

import type {
  AdminAuditClassificationFilter,
  AdminAuditPriorityFilter,
} from '@/schemas/adminAudit'
import {
  ADMIN_AUDIT_CARD_SHADOW,
  ADMIN_AUDIT_CARD_SHELL,
} from './adminAuditStyles'
import AdminAuditSelectField from './AdminAuditSelectField'

interface AdminAuditFiltersBarProps {
  priority: AdminAuditPriorityFilter
  classification: AdminAuditClassificationFilter
  onPriorityChange: (value: AdminAuditPriorityFilter) => void
  onClassificationChange: (value: AdminAuditClassificationFilter) => void
}

const PRIORITY_OPTIONS: { value: AdminAuditPriorityFilter; label: string }[] = [
  { value: 'all', label: 'الكل' },
  { value: 'urgent', label: 'عاجل' },
  { value: 'normal', label: 'عادي' },
]

const CLASSIFICATION_OPTIONS: { value: AdminAuditClassificationFilter; label: string }[] = [
  { value: 'all', label: 'الكل' },
  { value: 'medical', label: 'طبي' },
  { value: 'logistics', label: 'لوجستي' },
]

export default function AdminAuditFiltersBar({
  priority,
  classification,
  onPriorityChange,
  onClassificationChange,
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
          label="التصنيف"
          value={classification}
          onValueChange={(v) => onClassificationChange(v as AdminAuditClassificationFilter)}
          options={CLASSIFICATION_OPTIONS}
        />
      </div>
    </section>
  )
}
