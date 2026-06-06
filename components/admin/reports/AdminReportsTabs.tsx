'use client'

import type { AdminReportsTab } from '@/schemas/adminReports'
import { ADMIN_REPORTS_TABS } from '@/lib/mocks/adminReportsMockData'
import { ADMIN_REPORTS_BLUE, ADMIN_REPORTS_FONT, ADMIN_REPORTS_INPUT_BG } from './adminReportsStyles'

interface AdminReportsTabsProps {
  activeTab: AdminReportsTab
  onTabChange: (tab: AdminReportsTab) => void
  className?: string
}

export default function AdminReportsTabs({
  activeTab,
  onTabChange,
  className = '',
}: AdminReportsTabsProps) {
  return (
    <div
      className={`no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto ${className}`}
      dir="rtl"
    >
      {ADMIN_REPORTS_TABS.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className="shrink-0 snap-start whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition-opacity hover:opacity-90 sm:px-4 sm:py-2 sm:text-sm"
            style={{
              fontFamily: ADMIN_REPORTS_FONT,
              background: isActive ? ADMIN_REPORTS_BLUE : ADMIN_REPORTS_INPUT_BG,
              color: isActive ? '#fff' : ADMIN_REPORTS_BLUE,
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
