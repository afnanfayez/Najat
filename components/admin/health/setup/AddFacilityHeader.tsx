'use client'

import { Save } from 'lucide-react'
import AdminMobileHeader from '../../dashboard/AdminMobileHeader'
import { useAdminShell } from '../../AdminShellContext'
import {
  ADMIN_PAGE_SUBTITLE_STYLE,
  ADMIN_PAGE_TITLE_STYLE,
} from '../../layout/adminLayoutStyles'
import { SETUP_BLUE, SETUP_FONT } from './setupStyles'

interface AddFacilityHeaderProps {
  onCancel: () => void
  onSave: () => void
  saving?: boolean
  title?: string
  subtitle?: string
}

export default function AddFacilityHeader({
  onCancel,
  onSave,
  saving = false,
  title = 'إعداد المنشأة الصحية',
  subtitle = 'أدخل تفاصيل المركز الطبي وتحديث حالات التوفر والخدمات',
}: AddFacilityHeaderProps) {
  const shell = useAdminShell()

  return (
    <header className="mb-6" dir="rtl">
      <AdminMobileHeader onMenuOpen={() => shell?.openMobileMenu()} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 text-right">
          <h1 style={ADMIN_PAGE_TITLE_STYLE}>{title}</h1>
          <p style={{ ...ADMIN_PAGE_SUBTITLE_STYLE, marginTop: '8px' }}>
            {subtitle}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3 self-start">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-5 py-3 text-sm font-bold text-[#64748B] transition-opacity hover:opacity-80"
            style={{
              fontFamily: SETUP_FONT,
              background: '#F1F5F9',
            }}
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: SETUP_BLUE, fontFamily: SETUP_FONT }}
          >
            <Save size={18} strokeWidth={2.5} />
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>
    </header>
  )
}
