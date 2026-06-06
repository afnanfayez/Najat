'use client'

import type { AdminSecurityTab } from '@/schemas/adminSecurity'
import { ADMIN_SECURITY_TABS } from '@/lib/mocks/adminSecurityMockData'
import {
  ADMIN_SECURITY_BLUE,
  ADMIN_SECURITY_FONT,
  ADMIN_SECURITY_INPUT_BG,
} from './adminSecurityStyles'

interface AdminSecurityTabsProps {
  activeTab: AdminSecurityTab
  onTabChange: (tab: AdminSecurityTab) => void
  className?: string
}

export default function AdminSecurityTabs({
  activeTab,
  onTabChange,
  className = '',
}: AdminSecurityTabsProps) {
  return (
    <div
      className={`no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto ${className}`}
      dir="rtl"
    >
      {ADMIN_SECURITY_TABS.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className="shrink-0 snap-start whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition-opacity hover:opacity-90 sm:px-4 sm:py-2 sm:text-sm"
            style={{
              fontFamily: ADMIN_SECURITY_FONT,
              background: isActive ? ADMIN_SECURITY_BLUE : ADMIN_SECURITY_INPUT_BG,
              color: isActive ? '#fff' : ADMIN_SECURITY_BLUE,
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
