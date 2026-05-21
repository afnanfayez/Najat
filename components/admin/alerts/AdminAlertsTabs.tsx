'use client'

import type { AdminAlertsTab } from '@/schemas/adminAlert'
import { ADMIN_ALERTS_TABS } from '@/lib/mocks/adminAlertsMockData'
import {
  ADMIN_TAB_ACTIVE_COLOR,
  ADMIN_TAB_BORDER_COLOR,
  ADMIN_TAB_INACTIVE_COLOR,
} from '../layout/adminLayoutStyles'

interface AdminAlertsTabsProps {
  activeTab: AdminAlertsTab
  onTabChange: (tab: AdminAlertsTab) => void
}

export default function AdminAlertsTabs({ activeTab, onTabChange }: AdminAlertsTabsProps) {
  return (
    <div
      className="no-scrollbar mb-6 flex items-center justify-start gap-6 overflow-x-auto border-b border-[#E2E8F0] sm:gap-10"
    >
      {ADMIN_ALERTS_TABS.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            className="admin-tab"
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '6px 20px 10px',
              background: 'transparent',
              border: 'none',
              borderBottom: isActive
                ? `3px solid ${ADMIN_TAB_BORDER_COLOR}`
                : '3px solid transparent',
              cursor: 'pointer',
              fontFamily: "'Cairo', sans-serif",
              fontWeight: isActive ? 700 : 500,
              fontSize: '14px',
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
