'use client'

import type { AdminHealthViewTab } from '@/schemas/adminHealth'
import { ADMIN_HEALTH_BLUE, ADMIN_HEALTH_FONT } from './adminHealthStyles'

const TABS: { id: AdminHealthViewTab; label: string }[] = [
  { id: 'facilities', label: 'المنشآت الصحية' },
  { id: 'content', label: 'المحتوى الطبي' },
]

interface AdminHealthViewTabsProps {
  activeTab: AdminHealthViewTab
  onTabChange: (tab: AdminHealthViewTab) => void
}

export default function AdminHealthViewTabs({
  activeTab,
  onTabChange,
}: AdminHealthViewTabsProps) {
  return (
    <div className="flex shrink-0 items-center gap-2 self-start">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className="rounded-full px-5 py-2.5 text-sm font-bold transition-all"
            style={{
              fontFamily: ADMIN_HEALTH_FONT,
              background: isActive ? ADMIN_HEALTH_BLUE : `${ADMIN_HEALTH_BLUE}1A`,
              color: isActive ? '#fff' : ADMIN_HEALTH_BLUE,
              border: isActive ? 'none' : `1px solid ${ADMIN_HEALTH_BLUE}33`,
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
