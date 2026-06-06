'use client'

import type { AdminDataFilterTab } from '@/schemas/adminData'
import { ADMIN_DATA_BLUE, ADMIN_DATA_FONT } from './adminDataStyles'

const TABS: { id: AdminDataFilterTab; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'under_review', label: 'قيد المراجعة' },
  { id: 'reviewed', label: 'تمت المراجعة' },
  { id: 'published', label: 'تم النشر' },
]

interface AdminDataFilterTabsProps {
  active: AdminDataFilterTab
  onChange: (tab: AdminDataFilterTab) => void
}

export default function AdminDataFilterTabs({
  active,
  onChange,
}: AdminDataFilterTabsProps) {
  return (
    <div className="mb-4 -mx-1 overflow-x-auto pb-1 sm:mb-6 sm:overflow-visible" dir="rtl">
      <div className="flex min-w-max items-center gap-2 px-1 sm:min-w-0 sm:flex-wrap">
        {TABS.map((tab) => {
          const selected = active === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className="shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all sm:px-5 sm:py-2.5 sm:text-sm"
              style={{
                fontFamily: ADMIN_DATA_FONT,
                background: selected ? ADMIN_DATA_BLUE : '#F1F5F9',
                color: selected ? '#fff' : '#64748B',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
