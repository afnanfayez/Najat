'use client'

import type { AdminAidViewTab } from '@/schemas/adminAid'
import { ADMIN_AID_BLUE, ADMIN_AID_FONT } from './adminAidStyles'

const TABS: { id: AdminAidViewTab; label: string }[] = [
  { id: 'distribution', label: 'نقاط التوزيع والمخزون' },
  { id: 'donors', label: 'المانحون والشركاء' },
]

interface AdminAidViewTabsProps {
  activeTab: AdminAidViewTab
  onTabChange: (tab: AdminAidViewTab) => void
}

export default function AdminAidViewTabs({
  activeTab,
  onTabChange,
}: AdminAidViewTabsProps) {
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
              fontFamily: ADMIN_AID_FONT,
              background: isActive ? ADMIN_AID_BLUE : `${ADMIN_AID_BLUE}1A`,
              color: isActive ? '#fff' : ADMIN_AID_BLUE,
              border: isActive ? 'none' : `1px solid ${ADMIN_AID_BLUE}33`,
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
