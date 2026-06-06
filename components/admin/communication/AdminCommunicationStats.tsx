'use client'

import type { AdminCommunicationStats } from '@/schemas/adminCommunication'
import {
  ADMIN_COMM_BLUE,
  ADMIN_COMM_CARD_SHADOW,
  ADMIN_COMM_FONT,
} from './adminCommunicationStyles'

interface AdminCommunicationStatsProps {
  stats: AdminCommunicationStats
}

const STAT_ITEMS = [
  { key: 'activeInProgress' as const, label: 'قيد التنفيذ النشط' },
  { key: 'criticalCases' as const, label: 'حالات حرجة تتطلب تدخل', pad: true },
  { key: 'completedLast24h' as const, label: 'مهام مكتملة (آخر 24 ساعة)' },
]

export default function AdminCommunicationStats({ stats }: AdminCommunicationStatsProps) {
  return (
    <section className="mb-4 grid min-w-0 grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-3 sm:gap-4">
      {STAT_ITEMS.map((item) => {
        const value = stats[item.key]
        const display =
          item.pad && value < 10 ? value.toString().padStart(2, '0') : value.toLocaleString('en-US')

        return (
          <div
            key={item.key}
            className="min-w-0 rounded-xl bg-white px-4 py-4 sm:px-5 sm:py-5"
            style={{ boxShadow: ADMIN_COMM_CARD_SHADOW }}
            dir="rtl"
          >
            <p
              className="text-right text-xs font-bold text-[#0F172A] sm:text-sm"
              style={{ fontFamily: ADMIN_COMM_FONT }}
            >
              {item.label}
            </p>
            <p
              className="mt-2 text-right text-3xl font-bold leading-none sm:text-[36px]"
              style={{ color: ADMIN_COMM_BLUE, fontFamily: ADMIN_COMM_FONT }}
            >
              {display}
            </p>
          </div>
        )
      })}
    </section>
  )
}
