'use client'

import AdminMobileHeader from './AdminMobileHeader'

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
    <header className="mb-6">
      <AdminMobileHeader onMenuOpen={onMenuOpen} />

      <h1
        className="text-right text-2xl font-bold text-[#1E293B] sm:text-[28px]"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        مرحباً بك، {firstName}
      </h1>
      <p
        className="mt-2 text-right text-sm text-black sm:text-base"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        إليك ملخص العمليات الميدانية لهذا اليوم.
      </p>
    </header>
  )
}
