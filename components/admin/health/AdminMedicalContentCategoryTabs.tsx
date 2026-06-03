'use client'

import type { AdminHealthContentCategory } from '@/schemas/adminHealth'
import { ADMIN_HEALTH_CONTENT_CATEGORIES } from '@/lib/mocks/adminHealthMockData'
import { ADMIN_HEALTH_FONT } from './adminHealthStyles'

interface AdminMedicalContentCategoryTabsProps {
  active: AdminHealthContentCategory
  onChange: (category: AdminHealthContentCategory) => void
}

export default function AdminMedicalContentCategoryTabs({
  active,
  onChange,
}: AdminMedicalContentCategoryTabsProps) {
  return (
    <nav
      className="flex flex-wrap items-center gap-6 border-b border-[#E8EEF5] pb-1"
      dir="rtl"
      aria-label="تصنيفات المحتوى"
    >
      {ADMIN_HEALTH_CONTENT_CATEGORIES.map((category) => {
        const isActive = active === category.id
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className="relative pb-3 text-sm font-bold transition-colors sm:text-base"
            style={{
              fontFamily: ADMIN_HEALTH_FONT,
              color: isActive ? '#1E293B' : '#94A3B8',
            }}
          >
            {category.label}
            {isActive && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#FF9800]" />
            )}
          </button>
        )
      })}
    </nav>
  )
}
