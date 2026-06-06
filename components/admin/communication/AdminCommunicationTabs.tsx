'use client'

import type { AdminCommunicationTab } from '@/schemas/adminCommunication'
import { ADMIN_COMMUNICATION_TABS } from '@/lib/mocks/adminCommunicationMockData'
import {
  ADMIN_TAB_ACTIVE_COLOR,
  ADMIN_TAB_BORDER_COLOR,
  ADMIN_TAB_INACTIVE_COLOR,
} from '../layout/adminLayoutStyles'

interface AdminCommunicationTabsProps {
  activeTab: AdminCommunicationTab
  onTabChange: (tab: AdminCommunicationTab) => void
  className?: string
}

export default function AdminCommunicationTabs({
  activeTab,
  onTabChange,
  className = '',
}: AdminCommunicationTabsProps) {
  return (
    <div
      className={`no-scrollbar flex snap-x snap-mandatory items-center justify-start gap-4 overflow-x-auto border-b border-[#E2E8F0] sm:gap-8 md:gap-10 ${className}`}
    >
      {ADMIN_COMMUNICATION_TABS.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            className="admin-tab shrink-0 snap-start"
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '6px 12px 10px',
              background: 'transparent',
              border: 'none',
              borderBottom: isActive
                ? `3px solid ${ADMIN_TAB_BORDER_COLOR}`
                : '3px solid transparent',
              cursor: 'pointer',
              fontFamily: "'Cairo', sans-serif",
              fontWeight: isActive ? 700 : 500,
              fontSize: '13px',
              color: isActive ? ADMIN_TAB_ACTIVE_COLOR : ADMIN_TAB_INACTIVE_COLOR,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              marginBottom: '-1px',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
