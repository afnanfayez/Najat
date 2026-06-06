'use client'

import {
  ADMIN_PAGE_SUBTITLE_STYLE,
  ADMIN_PAGE_TITLE_STYLE,
} from '../layout/adminLayoutStyles'
import { ADMIN_DATA_BLUE, ADMIN_DATA_FONT } from './adminDataStyles'

interface AdminDataPageHeaderProps {
  title: string
  subtitle: string
  action?: React.ReactNode
}

export default function AdminDataPageHeader({
  title,
  subtitle,
  action,
}: AdminDataPageHeaderProps) {
  return (
    <header className="mb-4 sm:mb-6">
      <div className="flex w-full min-w-0 flex-col gap-3 sm:gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-5">
        <div className="min-w-0 flex-1 text-right">
          <h1 className="break-words text-balance" style={ADMIN_PAGE_TITLE_STYLE}>{title}</h1>
          <p className="break-words text-pretty" style={{ ...ADMIN_PAGE_SUBTITLE_STYLE, marginTop: '8px' }}>{subtitle}</p>
        </div>

        {action && (
          <div className="flex w-full shrink-0 sm:w-auto lg:self-start">{action}</div>
        )}
      </div>
    </header>
  )
}

export function AdminDataPrimaryButton({
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
      className={`w-full rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-5 sm:py-3 sm:text-sm ${className}`}
      style={{ background: ADMIN_DATA_BLUE, fontFamily: ADMIN_DATA_FONT }}
    >
      {children}
    </button>
  )
}
