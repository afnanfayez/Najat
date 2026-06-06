'use client'

import type { ReactNode } from 'react'
import { BarChart3, ShieldCheck } from 'lucide-react'
import type { AdminCommunicationFeedbackSummary } from '@/schemas/adminCommunication'
import {
  ADMIN_COMM_BLUE,
  ADMIN_COMM_CARD_SHADOW,
  ADMIN_COMM_FONT,
} from '../adminCommunicationStyles'

interface AdminCommunicationFeedbackStatsRowProps {
  summary: AdminCommunicationFeedbackSummary
  className?: string
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div
      className="min-w-0 flex-1 rounded-xl border border-[#E8EEF5] bg-white px-3 py-3 sm:min-w-[148px] sm:px-4 sm:py-4 md:min-w-[168px] md:px-5"
      style={{ fontFamily: ADMIN_COMM_FONT, boxShadow: ADMIN_COMM_CARD_SHADOW }}
    >
      <div className="mb-2 flex items-center justify-between gap-2" dir="ltr">
        <span className="truncate text-xs font-semibold text-[#64748B] sm:text-sm">
          {label}
        </span>
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8"
          style={{ background: '#E3F2FD', color: ADMIN_COMM_BLUE }}
        >
          {icon}
        </span>
      </div>
      <p
        className="truncate text-center text-base font-bold sm:text-lg md:text-xl"
        style={{ color: ADMIN_COMM_BLUE }}
      >
        {value}
      </p>
    </div>
  )
}

export default function AdminCommunicationFeedbackStatsRow({
  summary,
  className = '',
}: AdminCommunicationFeedbackStatsRowProps) {
  return (
    <div
      className={`grid w-full min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3 ${className}`}
      dir="rtl"
    >
      <StatCard
        icon={<BarChart3 size={18} strokeWidth={2.5} />}
        label="الوصول الإجمالي"
        value={summary.totalReach}
      />
      <StatCard
        icon={<ShieldCheck size={18} strokeWidth={2.5} />}
        label="النبض العام"
        value={summary.generalPulse}
      />
    </div>
  )
}
