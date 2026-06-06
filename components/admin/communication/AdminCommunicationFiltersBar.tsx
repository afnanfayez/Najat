'use client'

import { ADMIN_USER_REGION_OPTIONS } from '@/lib/mocks/adminUsersMockData'
import type {
  AdminCommunicationPriorityFilter,
  AdminCommunicationRegionFilter,
  AdminCommunicationVolunteerFilter,
} from '@/schemas/adminCommunication'
import {
  ADMIN_COMM_CARD_SHADOW,
  ADMIN_COMM_CARD_SHELL,
} from './adminCommunicationStyles'
import AdminCommunicationSelectField from './AdminCommunicationSelectField'
import { getAdminCommunicationVolunteers } from './data/adminCommunicationService'

interface AdminCommunicationFiltersBarProps {
  priority: AdminCommunicationPriorityFilter
  region: AdminCommunicationRegionFilter
  volunteer: AdminCommunicationVolunteerFilter
  onPriorityChange: (value: AdminCommunicationPriorityFilter) => void
  onRegionChange: (value: AdminCommunicationRegionFilter) => void
  onVolunteerChange: (value: AdminCommunicationVolunteerFilter) => void
}

const PRIORITY_OPTIONS: { value: AdminCommunicationPriorityFilter; label: string }[] = [
  { value: 'all', label: 'الكل' },
  { value: 'critical', label: 'شديد الأهمية' },
  { value: 'active', label: 'نشط' },
  { value: 'normal', label: 'عادي' },
  { value: 'low', label: 'منخفض' },
]

const regionOptions = [
  { value: 'all', label: 'الكل' },
  ...ADMIN_USER_REGION_OPTIONS.map((option) => ({ value: option, label: option })),
]

const volunteerOptions = [
  { value: 'all', label: 'الكل' },
  ...getAdminCommunicationVolunteers().map((v) => ({ value: v.id, label: v.name })),
]

export default function AdminCommunicationFiltersBar({
  priority,
  region,
  volunteer,
  onPriorityChange,
  onRegionChange,
  onVolunteerChange,
}: AdminCommunicationFiltersBarProps) {
  return (
    <section
      className={`mb-4 sm:mb-6 ${ADMIN_COMM_CARD_SHELL}`}
      style={{ boxShadow: ADMIN_COMM_CARD_SHADOW }}
      dir="rtl"
    >
      <div className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 md:grid-cols-3 md:gap-6">
        <AdminCommunicationSelectField
          label="حسب الأولوية"
          value={priority}
          onValueChange={(v) => onPriorityChange(v as AdminCommunicationPriorityFilter)}
          options={PRIORITY_OPTIONS}
        />
        <AdminCommunicationSelectField
          label="حسب المنطقة"
          value={region}
          onValueChange={(v) => onRegionChange(v as AdminCommunicationRegionFilter)}
          options={regionOptions}
        />
        <AdminCommunicationSelectField
          label="حسب المتطوع"
          value={volunteer}
          onValueChange={(v) => onVolunteerChange(v as AdminCommunicationVolunteerFilter)}
          options={volunteerOptions}
        />
      </div>
    </section>
  )
}
