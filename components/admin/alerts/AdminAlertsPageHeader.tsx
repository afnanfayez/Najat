'use client'

import {
  ADMIN_PAGE_SUBTITLE_STYLE,
  ADMIN_PAGE_TITLE_STYLE,
} from '../layout/adminLayoutStyles'

export default function AdminAlertsPageHeader() {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h1 style={ADMIN_PAGE_TITLE_STYLE}>إدارة التنبيهات العاجلة</h1>
        <p style={ADMIN_PAGE_SUBTITLE_STYLE}>
          مركز التحكم والتدخل السريع للحالات الطارئة
        </p>
      </div>
    </div>
  )
}
