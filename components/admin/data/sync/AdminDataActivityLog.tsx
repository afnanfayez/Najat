'use client'

import { User } from 'lucide-react'
import type { AdminDataActivityEntry } from '@/schemas/adminData'
import {
  ADMIN_DATA_BLUE,
  ADMIN_DATA_CARD_SHADOW,
  ADMIN_DATA_CARD_SHELL,
  ADMIN_DATA_FONT,
  ADMIN_DATA_INPUT_BG,
} from '../adminDataStyles'

interface AdminDataActivityLogProps {
  entries: AdminDataActivityEntry[]
}

export default function AdminDataActivityLog({ entries }: AdminDataActivityLogProps) {
  return (
    <section
      className={ADMIN_DATA_CARD_SHELL}
      style={{ boxShadow: ADMIN_DATA_CARD_SHADOW }}
      dir="rtl"
    >
      <h2
        className="mb-3 text-right text-base font-bold text-[#0F172A] sm:mb-4 sm:text-lg"
        style={{ fontFamily: ADMIN_DATA_FONT }}
      >
        سجل المراجعة والنشاط
      </h2>

      <div className="grid min-w-0 grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
        {entries.map((entry) => (
          <article
            key={entry.id}
            className="flex min-w-0 items-start justify-between gap-2 rounded-xl border border-[#E8EEF5] bg-white p-3"
          >
            <div className="flex min-w-0 flex-1 items-start gap-2 overflow-hidden">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10"
                style={{ background: ADMIN_DATA_INPUT_BG }}
              >
                <User size={16} className="text-[#2196F3] sm:h-[18px] sm:w-[18px]" strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden text-right">
                <p
                  className="truncate text-xs font-bold text-[#0F172A]"
                  style={{ fontFamily: ADMIN_DATA_FONT }}
                  title={entry.actor}
                >
                  {entry.actor}
                </p>
                <p
                  className="mt-0.5 truncate text-[11px] font-semibold leading-4 text-[#0F172A] sm:text-xs"
                  style={{ fontFamily: ADMIN_DATA_FONT }}
                  title={entry.action}
                >
                  {entry.action}
                </p>
              </div>
            </div>

            <span
              className="shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold sm:px-2.5 sm:text-[11px]"
              style={{
                fontFamily: ADMIN_DATA_FONT,
                color: ADMIN_DATA_BLUE,
                background: ADMIN_DATA_INPUT_BG,
              }}
            >
              {entry.timeAgo}
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}
