'use client'

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
  hideTabs?: boolean
}

export default function AdminAidPageHeader({
  activeTab,
  onTabChange,
  title,
  subtitle,
  action,
  hideTabs = false,
}: AdminAidPageHeaderProps) {
  const resolvedTitle =
    title ??
    (activeTab === 'donors'
      ? 'المانحون والشراكات'
      : activeTab === 'requests'
        ? 'طلبات المساعدة من المواطنين'
        : 'إدارة المساعدات الإنسانية')

  const resolvedSubtitle =
    subtitle ??
    (activeTab === 'donors'
      ? 'إدارة وتتبع المساهمات الإنسانية والشركاء الاستراتيجيين'
      : activeTab === 'requests'
        ? 'عرض ومتابعة طلبات المساعدة المقدمة من المواطنين'
        : 'مراقبة نقاط التوزيع والمخزون والاستجابة الإنسانية')

  return (
    <header className="mb-6">
      <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 text-right">
          <h1 style={ADMIN_PAGE_TITLE_STYLE}>{resolvedTitle}</h1>
          <p style={{ ...ADMIN_PAGE_SUBTITLE_STYLE, marginTop: '8px' }}>
            {resolvedSubtitle}
          </p>
        </div>

        <div className="flex w-full min-w-0 flex-row flex-wrap items-center gap-2 sm:w-auto sm:gap-3 lg:self-start">
          {action}
          {!hideTabs && (
            <AdminAidViewTabs activeTab={activeTab} onTabChange={onTabChange} />
          )}
        </div>
      </div>
    </header>
  )
}
