'use client'

import { Clock, RefreshCw, TrendingUp } from 'lucide-react'
import type { AdminDataSyncStatus } from '@/schemas/adminData'
import {
  ADMIN_DATA_BLUE,
  ADMIN_DATA_CARD_SHADOW,
  ADMIN_DATA_FONT,
  ADMIN_DATA_INPUT_BG,
} from '../adminDataStyles'

interface AdminDataSyncStatusCardProps {
  status: AdminDataSyncStatus
  publishingAll?: boolean
  onPublishAll?: () => void | Promise<void>
}

const STATUS_ITEMS = [
  { key: 'lastSyncAgo' as const, label: 'آخر وقت للمزامنة', icon: Clock },
  { key: 'successRate' as const, label: 'معدل النجاح', icon: TrendingUp, suffix: '%' },
  { key: 'queueCount' as const, label: 'عناصر في الانتظار', icon: RefreshCw, suffix: ' طلب جاهز' },
]

export default function AdminDataSyncStatusCard({
  status,
  publishingAll = false,
  onPublishAll,
}: AdminDataSyncStatusCardProps) {
  return (
    <aside
      className="flex h-full min-h-0 flex-col rounded-xl border border-[#E8EEF5] bg-white p-4 lg:h-full"
      style={{ boxShadow: ADMIN_DATA_CARD_SHADOW }}
      dir="rtl"
    >
      <h2
        className="mb-2.5 shrink-0 text-right text-sm font-bold text-[#0F172A]"
        style={{ fontFamily: ADMIN_DATA_FONT }}
      >
        حالة المزامنة
      </h2>

      <div className="flex flex-col gap-2 lg:min-h-0 lg:flex-1">
        {STATUS_ITEMS.map((item) => {
          const Icon = item.icon
          const rawValue = status[item.key]
          const displayValue =
            item.key === 'successRate'
              ? `${rawValue}${item.suffix ?? ''}`
              : item.key === 'queueCount'
                ? `${rawValue}${item.suffix ?? ''}`
                : rawValue

          return (
            <div
              key={item.key}
              className="rounded-lg border border-[#E8EEF5] px-3 py-2 lg:flex lg:flex-1 lg:flex-col lg:justify-center"
              style={{ background: ADMIN_DATA_INPUT_BG }}
            >
              <div className="flex items-center justify-start gap-1.5">
                <Icon size={14} className="shrink-0 text-[#2196F3]" strokeWidth={2.5} />
                <p
                  className="text-[11px] font-bold leading-none text-[#64748B] sm:text-xs"
                  style={{ fontFamily: ADMIN_DATA_FONT }}
                >
                  {item.label}
                </p>
              </div>
              <p
                className="mt-1 text-right text-xs font-bold leading-none text-[#2196F3]"
                style={{ fontFamily: ADMIN_DATA_FONT }}
              >
                {displayValue}
              </p>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        disabled={publishingAll}
        onClick={() => onPublishAll?.()}
        className="mt-3 shrink-0 w-full rounded-lg py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:text-sm"
        style={{ background: ADMIN_DATA_BLUE, fontFamily: ADMIN_DATA_FONT }}
      >
        {publishingAll ? 'جاري النشر...' : 'نشر لكل الأجهزة'}
      </button>
    </aside>
  )
}
