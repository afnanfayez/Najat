'use client'

import {
  ADMIN_PAGE_SUBTITLE_STYLE,
  ADMIN_PAGE_TITLE_STYLE,
} from '../layout/adminLayoutStyles'

interface AdminDashboardHeaderProps {
  userName?: string
}

export default function AdminDashboardHeader({ userName }: AdminDashboardHeaderProps) {
  const firstName = userName?.split(' ')[0] ?? 'مدير'

  return (
    <header style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h1 style={ADMIN_PAGE_TITLE_STYLE}>مرحباً بك، {firstName}</h1>
        <p style={ADMIN_PAGE_SUBTITLE_STYLE}>
          إليك ملخص العمليات الميدانية لهذا اليوم.
        </p>
      </div>
    </header>
  )
}
