'use client'

import AdminMobileHeader from '../dashboard/AdminMobileHeader'
import { useAdminShell } from '../AdminShellContext'
import {
  ADMIN_PAGE_SUBTITLE_STYLE,
  ADMIN_PAGE_TITLE_STYLE,
} from '../layout/adminLayoutStyles'
import AdminAidViewTabs from './AdminAidViewTabs'
import type { AdminAidViewTab } from '@/schemas/adminAid'

interface AdminAidPageHeaderProps {
  activeTab: AdminAidViewTab
  onTabChange: (tab: AdminAidViewTab) => void
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export default function AdminAidPageHeader({
  activeTab,
  onTabChange,
  title,
  subtitle,
  action,
}: AdminAidPageHeaderProps) {
  const shell = useAdminShell()

  const resolvedTitle =
    title ??
    (activeTab === 'donors'
      ? 'المانحون والشراكات'
      : 'إدارة المساعدات الإنسانية')

  const resolvedSubtitle =
    subtitle ??
    (activeTab === 'donors'
      ? 'إدارة وتتبع المساهمات الإنسانية والشركاء الاستراتيجيين'
      : 'مراقبة نقاط التوزيع والمخزون والاستجابة الإنسانية')

  return (
    <header className="mb-6">
      <AdminMobileHeader onMenuOpen={() => shell?.openMobileMenu()} />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 text-right">
          <h1 style={ADMIN_PAGE_TITLE_STYLE}>{resolvedTitle}</h1>
          <p style={{ ...ADMIN_PAGE_SUBTITLE_STYLE, marginTop: '8px' }}>
            {resolvedSubtitle}
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {action}
          <AdminAidViewTabs activeTab={activeTab} onTabChange={onTabChange} />
        </div>
      </div>
    </header>
  )
}
