'use client'

import type { AdminDataInventoryItem } from '@/schemas/adminData'
import {
  ADMIN_DATA_CARD_SHADOW,
  ADMIN_DATA_FONT,
} from '../adminDataStyles'

interface AdminDataInventoryCardProps {
  items: AdminDataInventoryItem[]
}

export default function AdminDataInventoryCard({ items }: AdminDataInventoryCardProps) {
  return (
    <article
      className="h-full rounded-2xl border border-[#E8EEF5] bg-white p-4 sm:p-5"
      style={{ boxShadow: ADMIN_DATA_CARD_SHADOW }}
      dir="rtl"
    >
      <h2
        className="mb-4 text-right text-base font-bold text-[#0F172A] sm:text-lg"
        style={{ fontFamily: ADMIN_DATA_FONT }}
      >
        مستويات المخزون
      </h2>
      <div className="space-y-4">
        {items.map((item) => {
          const barColor = item.variant === 'success' ? '#22C55E' : '#EF4444'
          return (
            <div key={item.id}>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span
                  className="text-xs font-bold text-[#64748B] sm:text-sm"
                  style={{ fontFamily: ADMIN_DATA_FONT }}
                >
                  {item.label}
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: barColor, fontFamily: ADMIN_DATA_FONT }}
                >
                  {item.percent}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#E8EEF5]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.percent}%`, background: barColor }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}
