'use client'

import { ChevronDown } from 'lucide-react'
import type {
  AdminAuditClassificationFilter,
  AdminAuditPriorityFilter,
} from '@/schemas/adminAudit'
import {
  ADMIN_AUDIT_CARD_SHADOW,
  ADMIN_AUDIT_CARD_SHELL,
  ADMIN_AUDIT_FONT,
  ADMIN_AUDIT_INPUT_BG,
} from './adminAuditStyles'

interface AdminAuditFiltersBarProps {
  priority: AdminAuditPriorityFilter
  classification: AdminAuditClassificationFilter
  onPriorityChange: (value: AdminAuditPriorityFilter) => void
  onClassificationChange: (value: AdminAuditClassificationFilter) => void
}

const PRIORITY_OPTIONS: { id: AdminAuditPriorityFilter; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'urgent', label: 'عاجل' },
  { id: 'normal', label: 'عادي' },
]

const CLASSIFICATION_OPTIONS: { id: AdminAuditClassificationFilter; label: string }[] = [
  { id: 'all', label: 'جميع المحررين' },
  { id: 'medical', label: 'طبي' },
  { id: 'logistics', label: 'لوجستي' },
]

function AuditFilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { id: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <div className="min-w-0 flex-1 text-right">
      <p
        className="mb-2 text-sm font-bold text-[#0F172A]"
        style={{ fontFamily: ADMIN_AUDIT_FONT }}
      >
        {label}
      </p>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-[#E8EEF5] py-2.5 pl-4 pr-10 text-sm font-bold text-[#0F172A] outline-none focus:border-[#2196F3]"
          style={{ fontFamily: ADMIN_AUDIT_FONT, background: ADMIN_AUDIT_INPUT_BG }}
        >
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#E3F2FD]">
          <ChevronDown size={12} className="text-[#64B5F6]" strokeWidth={2.5} />
        </span>
      </div>
    </div>
  )
}

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
        <AuditFilterSelect
          label="الأولوية"
          value={priority}
          options={PRIORITY_OPTIONS}
          onChange={(v) => onPriorityChange(v as AdminAuditPriorityFilter)}
        />
        <AuditFilterSelect
          label="التصنيف"
          value={classification}
          options={CLASSIFICATION_OPTIONS}
          onChange={(v) => onClassificationChange(v as AdminAuditClassificationFilter)}
        />
      </div>
    </section>
  )
}
