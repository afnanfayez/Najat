'use client'

import type { ReactNode } from 'react'
import { SETUP_CARD_CLASS, SETUP_CARD_SHADOW, SETUP_SECTION_TITLE } from './setupStyles'

interface SetupSectionCardProps {
  title: string
  children: ReactNode
  className?: string
  headerAction?: ReactNode
}

export default function SetupSectionCard({
  title,
  children,
  className = '',
  headerAction,
}: SetupSectionCardProps) {
  return (
    <section
      className={`${SETUP_CARD_CLASS} flex h-full flex-col ${className}`}
      style={{ boxShadow: SETUP_CARD_SHADOW }}
      dir="rtl"
    >
      <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
        <h3 style={SETUP_SECTION_TITLE}>{title}</h3>
        {headerAction}
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </section>
  )
}
