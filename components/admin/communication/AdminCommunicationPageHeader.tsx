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
  sidePanel?: React.ReactNode
  mobileTabs?: React.ReactNode
}

export default function AdminCommunicationPageHeader({
  title,
  subtitle,
  action,
  sidePanel,
  mobileTabs,
}: AdminCommunicationPageHeaderProps) {
  const shell = useAdminShell()

  return (
    <header className="mb-4 min-w-0 sm:mb-6">
      <div className="lg:hidden">
        <AdminMobileHeader
          onMenuOpen={() => shell?.openMobileMenu()}
          style={{ marginBottom: 0, borderBottom: 'none' }}
        />
        {mobileTabs}
      </div>

      <div
        className="flex w-full min-w-0 flex-col gap-3 sm:gap-4 xl:flex-row xl:items-start xl:justify-between xl:gap-5"
        dir="rtl"
      >
        <div className="min-w-0 flex-1 text-right">
          <h1 className="break-words text-balance" style={ADMIN_PAGE_TITLE_STYLE}>
            {title}
          </h1>
          <p
            className="break-words text-pretty"
            style={{ ...ADMIN_PAGE_SUBTITLE_STYLE, marginTop: '8px' }}
          >
            {subtitle}
          </p>
        </div>

        {sidePanel && (
          <div className="w-full min-w-0 xl:w-auto xl:shrink-0">{sidePanel}</div>
        )}

        {action && (
          <div className="flex w-full min-w-0 shrink-0 xl:w-auto xl:self-start">
            {action}
          </div>
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
      className={`inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-5 sm:py-3 sm:text-sm ${className}`}
      style={{
        background: '#2196F3',
        fontFamily: "'Cairo', sans-serif",
      }}
    >
      {children}
    </button>
  )
}
