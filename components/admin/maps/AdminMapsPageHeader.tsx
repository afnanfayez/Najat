'use client'

import {
  ADMIN_PAGE_SUBTITLE_STYLE,
  ADMIN_PAGE_TITLE_STYLE,
} from '../layout/adminLayoutStyles'
import { ADMIN_MAPS_BLUE, ADMIN_MAPS_FONT } from './adminMapsStyles'

interface AdminMapsPageHeaderProps {
  onCreatePackage?: () => void
}

export default function AdminMapsPageHeader({
  onCreatePackage,
}: AdminMapsPageHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 text-right">
          <h1 style={ADMIN_PAGE_TITLE_STYLE}>مركز صيانة الخرائط والأوفلاين</h1>
          <p style={{ ...ADMIN_PAGE_SUBTITLE_STYLE, marginTop: '8px' }}>
            إدارة وتدقيق الحزم الجغرافية ونشر التحديثات الحرجة للفرق الميدانية
          </p>
        </div>

        <div className="flex w-full shrink-0 sm:w-auto lg:self-start">
          <button
            type="button"
            onClick={onCreatePackage}
            className="w-full rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 sm:w-auto sm:py-3 sm:text-sm"
            style={{ background: ADMIN_MAPS_BLUE, fontFamily: ADMIN_MAPS_FONT }}
          >
            انشاء حزمة خرائط جديدة
          </button>
        </div>
      </div>
    </header>
  )
}
