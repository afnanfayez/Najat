'use client'

import type { AdminCommunicationSystemResilience } from '@/schemas/adminCommunication'
import { ADMIN_COMM_CARD_SHADOW, ADMIN_COMM_FONT } from './adminCommunicationStyles'

interface AdminCommunicationResilienceCardProps {
  resilience: AdminCommunicationSystemResilience
}

export default function AdminCommunicationResilienceCard({
  resilience,
}: AdminCommunicationResilienceCardProps) {
  return (
    <aside
      className="flex h-full flex-col rounded-xl p-3 sm:p-4"
      style={{
        boxShadow: ADMIN_COMM_CARD_SHADOW,
        background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
      }}
      dir="rtl"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h2
          className="text-right text-sm font-bold text-white sm:text-base"
          style={{ fontFamily: ADMIN_COMM_FONT }}
        >
          {resilience.title}
        </h2>
        <span
          className="inline-flex shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white sm:text-[11px]"
          style={{ fontFamily: ADMIN_COMM_FONT }}
        >
          {resilience.statusLabel}
        </span>
      </div>

      <p
        className="flex-1 text-right text-[11px] leading-6 text-white/95 sm:text-xs sm:leading-7"
        style={{ fontFamily: ADMIN_COMM_FONT }}
      >
        {resilience.message}
      </p>

      <div className="mt-2 text-right">
        <p
          className="text-[10px] font-medium text-white/80 sm:text-[11px]"
          style={{ fontFamily: ADMIN_COMM_FONT }}
        >
          {resilience.lastCheckLabel}
        </p>
        <p
          className="text-xs font-bold text-white sm:text-sm"
          style={{ fontFamily: ADMIN_COMM_FONT }}
        >
          {resilience.lastCheckAgo}
        </p>
      </div>
    </aside>
  )
}
