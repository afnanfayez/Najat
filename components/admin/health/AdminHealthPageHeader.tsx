'use client'

import AdminMobileHeader from '../dashboard/AdminMobileHeader'
import { useAdminShell } from '../AdminShellContext'
import {
  ADMIN_PAGE_SUBTITLE_STYLE,
  ADMIN_PAGE_TITLE_STYLE,
} from '../layout/adminLayoutStyles'
import AdminHealthViewTabs from './AdminHealthViewTabs'
import type { AdminHealthViewTab } from '@/schemas/adminHealth'

interface AdminHealthPageHeaderProps {
  activeTab: AdminHealthViewTab
  onTabChange: (tab: AdminHealthViewTab) => void
}

export default function AdminHealthPageHeader({
  activeTab,
  onTabChange,
}: AdminHealthPageHeaderProps) {
  const shell = useAdminShell()

  return (
    <header className="mb-6">
      <AdminMobileHeader onMenuOpen={() => shell?.openMobileMenu()} />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 text-right">
          <h1 style={ADMIN_PAGE_TITLE_STYLE}>إدارة المعلومات الصحية</h1>
          <p style={{ ...ADMIN_PAGE_SUBTITLE_STYLE, marginTop: '8px' }}>
            مركز التحكم الموحد للمنشآت الطبية والمحتوى التوعوي
          </p>
        </div>

        <AdminHealthViewTabs activeTab={activeTab} onTabChange={onTabChange} />
      </div>
    </header>
  )
}
