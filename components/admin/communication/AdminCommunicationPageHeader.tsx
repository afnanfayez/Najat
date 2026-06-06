'use client'

import AdminMobileHeader from '../dashboard/AdminMobileHeader'
import { useAdminShell } from '../AdminShellContext'
import {
  ADMIN_PAGE_SUBTITLE_STYLE,
  ADMIN_PAGE_TITLE_STYLE,
} from '../layout/adminLayoutStyles'

interface AdminCommunicationPageHeaderProps {
  title: string
  subtitle: string
  action?: React.ReactNode
}

export default function AdminCommunicationPageHeader({
  title,
  subtitle,
  action,
}: AdminCommunicationPageHeaderProps) {
  const shell = useAdminShell()

  return (
    <header className="mb-4 sm:mb-6">
      <AdminMobileHeader onMenuOpen={() => shell?.openMobileMenu()} />

      <div className="flex w-full min-w-0 flex-col gap-3 sm:gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-5">
        <div className="min-w-0 flex-1 text-right">
          <h1 className="break-words text-balance" style={ADMIN_PAGE_TITLE_STYLE}>
            {title}
          </h1>
          <p className="break-words text-pretty" style={{ ...ADMIN_PAGE_SUBTITLE_STYLE, marginTop: '8px' }}>
            {subtitle}
          </p>
        </div>

        {action && (
          <div className="flex w-full shrink-0 sm:w-auto lg:self-start">{action}</div>
        )}
      </div>
    </header>
  )
}

export function AdminCommunicationPrimaryButton({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-5 sm:py-3 sm:text-sm ${className}`}
      style={{
        background: '#2196F3',
        fontFamily: "'Cairo', sans-serif",
      }}
    >
      {children}
    </button>
  )
}
