'use client'

import { Save } from 'lucide-react'
import AdminMobileHeader from '../../../dashboard/AdminMobileHeader'
import { useAdminShell } from '../../../AdminShellContext'
import {
  ADMIN_PAGE_SUBTITLE_STYLE,
  ADMIN_PAGE_TITLE_STYLE,
} from '../../../layout/adminLayoutStyles'
import { SETUP_BLUE, SETUP_FONT } from '../../setup/setupStyles'

interface DonorEditorHeaderProps {
  onCancel: () => void
  onSave: () => void
  saving?: boolean
  isEdit?: boolean
}

export default function DonorEditorHeader({
  onCancel,
  onSave,
  saving = false,
  isEdit = false,
}: DonorEditorHeaderProps) {
  const shell = useAdminShell()

  return (
    <header className="mb-6" dir="rtl">
      <AdminMobileHeader onMenuOpen={() => shell?.openMobileMenu()} />

      <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 lg:gap-4">
        <div className="min-w-0 flex-1 text-right">
          <h1 style={ADMIN_PAGE_TITLE_STYLE}>المانحون والشراكات</h1>
          <p style={{ ...ADMIN_PAGE_SUBTITLE_STYLE, marginTop: '8px' }}>
            {isEdit ? 'تعديل بيانات المانح' : 'إضافة مانح أو شريك جديد'}
          </p>
        </div>

        <div className="flex w-full shrink-0 flex-row items-stretch gap-2 sm:w-auto sm:items-center sm:gap-3 sm:self-start">
          <button
            type="button"
            onClick={onCancel}
            className="min-w-0 flex-1 rounded-xl px-3 py-2.5 text-xs font-bold text-[#64748B] transition-opacity hover:opacity-80 sm:flex-none sm:px-5 sm:py-3 sm:text-sm"
            style={{ fontFamily: SETUP_FONT, background: '#F1F5F9' }}
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:flex-none sm:gap-2 sm:px-5 sm:py-3 sm:text-sm"
            style={{ background: SETUP_BLUE, fontFamily: SETUP_FONT }}
          >
            <Save size={16} strokeWidth={2.5} className="shrink-0 sm:hidden" />
            <Save size={18} strokeWidth={2.5} className="hidden shrink-0 sm:block" />
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>
    </header>
  )
}
