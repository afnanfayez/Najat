'use client'

import { Heart, History, ShieldCheck, XCircle } from 'lucide-react'
import type { AdminDataStats } from '@/schemas/adminData'
import {
  ADMIN_DATA_BLUE,
  ADMIN_DATA_CARD_SHADOW,
  ADMIN_DATA_FONT,
} from './adminDataStyles'

interface AdminDataStatsProps {
  stats: AdminDataStats
}

const STAT_ITEMS = [
  {
    key: 'pendingReview' as const,
    label: 'بانتظار المراجعة',
    color: ADMIN_DATA_BLUE,
    icon: History,
  },
  {
    key: 'publishedToday' as const,
    label: 'تم النشر اليوم',
    color: '#4CAF50',
    icon: ShieldCheck,
  },
  {
    key: 'rejectedRequests' as const,
    label: 'طلبات مرفوضة',
    color: '#EF4444',
    icon: XCircle,
  },
  {
    key: 'activeVolunteers' as const,
    label: 'متطوعين نشطين',
    color: '#FF9800',
    icon: Heart,
  },
]

export default function AdminDataStats({ stats }: AdminDataStatsProps) {
  return (
    <section className="mb-4 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:mb-6 sm:gap-3 md:gap-4 xl:grid-cols-4">
      {STAT_ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.key}
            className="rounded-xl bg-white px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6"
            style={{ boxShadow: ADMIN_DATA_CARD_SHADOW }}
            dir="rtl"
          >
            <div className="flex w-full flex-col items-start text-right">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Icon
                  size={20}
                  className="sm:h-[22px] sm:w-[22px]"
                  style={{ color: item.color }}
                  strokeWidth={2.5}
                />
                <p
                  className="text-xs font-bold text-[#0F172A] sm:text-sm md:text-base"
                  style={{ fontFamily: ADMIN_DATA_FONT }}
                >
                  {item.label}
                </p>
              </div>
              <p
                className="mt-2 self-start text-2xl font-bold leading-none sm:mt-3 sm:text-[32px] md:text-[36px]"
                style={{ color: item.color, fontFamily: ADMIN_DATA_FONT }}
              >
                {stats[item.key].toLocaleString('en-US')}
              </p>
            </div>
          </div>
        )
      })}
    </section>
  )
}
