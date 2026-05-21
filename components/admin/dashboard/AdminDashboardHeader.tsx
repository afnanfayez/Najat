'use client'

import AdminMobileHeader from './AdminMobileHeader'
import {
  ADMIN_PAGE_SUBTITLE_STYLE,
  ADMIN_PAGE_TITLE_STYLE,
} from '../layout/adminLayoutStyles'

interface AdminDashboardHeaderProps {
  userName?: string
  onMenuOpen: () => void
}

export default function AdminDashboardHeader({
  userName,
  onMenuOpen,
}: AdminDashboardHeaderProps) {
  const firstName = userName?.split(' ')[0] ?? 'إسلام'

  return (
    <header style={{ marginBottom: '24px' }}>
      <AdminMobileHeader onMenuOpen={onMenuOpen} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h1 style={ADMIN_PAGE_TITLE_STYLE}>مرحباً بك، {firstName}</h1>
        <p style={ADMIN_PAGE_SUBTITLE_STYLE}>
          إليك ملخص العمليات الميدانية لهذا اليوم.
        </p>
      </div>
    </header>
  )
}
