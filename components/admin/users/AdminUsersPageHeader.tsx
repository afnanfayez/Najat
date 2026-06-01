'use client'

import { useRouter } from 'next/navigation'
import { UserPlus } from 'lucide-react'
import AdminMobileHeader from '../dashboard/AdminMobileHeader'
import { useAdminShell } from '../AdminShellContext'
import {
  ADMIN_PAGE_SUBTITLE_STYLE,
  ADMIN_PAGE_TITLE_STYLE,
} from '../layout/adminLayoutStyles'

export default function AdminUsersPageHeader() {
  const router = useRouter()
  const shell = useAdminShell()

  return (
    <header className="mb-6">
      <AdminMobileHeader onMenuOpen={() => shell?.openMobileMenu()} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 text-right">
          <h1 style={ADMIN_PAGE_TITLE_STYLE}>إدارة المستخدمين والصلاحيات</h1>
          <p style={{ ...ADMIN_PAGE_SUBTITLE_STYLE, marginTop: '8px' }}>
            يرجى ملء البيانات التالية للانضمام إلى فريق الاستجابة وإدارة الأزمات
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push('/admin/users/new')}
          className="flex shrink-0 items-center justify-center gap-2 self-start rounded-xl px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 sm:text-base"
          style={{ background: '#2196F3', fontFamily: "'Cairo', sans-serif" }}
        >
          <UserPlus size={20} strokeWidth={2.5} />
          إضافة متطوع جديد
        </button>
      </div>
    </header>
  )
}
