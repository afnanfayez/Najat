'use client'

import { Download } from 'lucide-react'
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
  return (
    <header className="mb-4 sm:mb-6">
      <div className="flex w-full min-w-0 flex-col gap-3 sm:gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-5">
        <div className="min-w-0 flex-1 text-right">
          <h1 className="break-words text-balance" style={ADMIN_PAGE_TITLE_STYLE}>
            مراجعة طلب التحديث: {title}
          </h1>
          <p
            className="break-words text-xs sm:text-sm"
            style={{ ...ADMIN_PAGE_SUBTITLE_STYLE, marginTop: '8px' }}
          >
            <span className="block sm:inline">رقم المعاملة: #{requestCode}</span>
            <span className="hidden sm:inline"> • </span>
            <span className="block sm:inline">{submittedAgo}</span>
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
