'use client'

import { Download } from 'lucide-react'
import AdminMobileHeader from '../../dashboard/AdminMobileHeader'
import { useAdminShell } from '../../AdminShellContext'
import {
  ADMIN_PAGE_SUBTITLE_STYLE,
  ADMIN_PAGE_TITLE_STYLE,
} from '../../layout/adminLayoutStyles'
import { AdminDataPrimaryButton } from '../AdminDataPageHeader'

interface AdminDataReviewHeaderProps {
  title: string
  requestCode: string
  submittedAgo: string
  onDownload?: () => void
}

export default function AdminDataReviewHeader({
  title,
  requestCode,
  submittedAgo,
  onDownload,
}: AdminDataReviewHeaderProps) {
  const shell = useAdminShell()

  return (
    <header className="mb-6">
      <AdminMobileHeader onMenuOpen={() => shell?.openMobileMenu()} />

      <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 text-right">
          <h1 style={ADMIN_PAGE_TITLE_STYLE}>مراجعة طلب التحديث: {title}</h1>
          <p style={{ ...ADMIN_PAGE_SUBTITLE_STYLE, marginTop: '8px' }}>
            رقم المعاملة: #{requestCode} • {submittedAgo}
          </p>
        </div>

        <div className="flex w-full shrink-0 sm:w-auto lg:self-start">
          <AdminDataPrimaryButton onClick={onDownload}>
            <span className="inline-flex items-center justify-center gap-1.5">
              <Download size={16} />
              تنزيل التقرير
            </span>
          </AdminDataPrimaryButton>
        </div>
      </div>
    </header>
  )
}
