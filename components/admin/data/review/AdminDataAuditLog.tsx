'use client'

import type { AdminDataAuditEntry } from '@/schemas/adminData'
import { ADMIN_DATA_BLUE, ADMIN_DATA_CARD_SHADOW, ADMIN_DATA_FONT } from '../adminDataStyles'

interface AdminDataAuditLogProps {
  entries: AdminDataAuditEntry[]
}

export default function AdminDataAuditLog({ entries }: AdminDataAuditLogProps) {
  return (
    <section
      className="rounded-2xl border border-[#E8EEF5] bg-white p-4 sm:p-5"
      style={{ boxShadow: ADMIN_DATA_CARD_SHADOW }}
      dir="rtl"
    >
      <h3
        className="mb-4 text-right text-sm font-bold text-[#2196F3] sm:text-base"
        style={{ fontFamily: ADMIN_DATA_FONT }}
      >
        سجل التدقيق
      </h3>
      <div className="space-y-4 border-r-2 border-[#E3F2FD] pr-4">
        {entries.map((entry) => (
          <div key={entry.id} className="relative text-right">
            <span
              className="absolute -right-[calc(1rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full"
              style={{ background: ADMIN_DATA_BLUE }}
            />
            <p
              className="text-xs font-bold text-[#0F172A] sm:text-sm"
              style={{ fontFamily: ADMIN_DATA_FONT }}
            >
              {entry.message}
            </p>
            <p
              className="mt-0.5 text-[11px] font-medium text-[#94A3B8]"
              style={{ fontFamily: ADMIN_DATA_FONT }}
            >
              {entry.actor} • {entry.time}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
