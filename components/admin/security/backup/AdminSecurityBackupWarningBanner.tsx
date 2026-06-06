'use client'

import { AlertTriangle } from 'lucide-react'
import { ADMIN_SECURITY_FONT } from '../adminSecurityStyles'

interface AdminSecurityBackupWarningBannerProps {
  message: string
}

export default function AdminSecurityBackupWarningBanner({
  message,
}: AdminSecurityBackupWarningBannerProps) {
  return (
    <div
      className="mb-4 flex items-start gap-3 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 sm:mb-6 sm:items-center sm:px-5 sm:py-3.5"
      dir="rtl"
      style={{ fontFamily: ADMIN_SECURITY_FONT }}
    >
      <AlertTriangle className="mt-0.5 shrink-0 text-[#EF4444] sm:mt-0" size={20} />
      <p className="min-w-0 flex-1 break-words text-right text-xs font-bold text-[#EF4444] sm:text-sm">
        {message}
      </p>
    </div>
  )
}
