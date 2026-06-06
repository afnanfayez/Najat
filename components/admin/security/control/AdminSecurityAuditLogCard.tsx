'use client'

import { ChevronLeft } from 'lucide-react'
import type { AdminSecurityAuditEntry } from '@/schemas/adminSecurity'
import {
  ADMIN_SECURITY_AUDIT_STATUS,
  ADMIN_SECURITY_CARD_SHELL,
  ADMIN_SECURITY_CARD_SHADOW,
  ADMIN_SECURITY_FONT,
} from '../adminSecurityStyles'

interface AdminSecurityAuditLogCardProps {
  title: string
  entries: AdminSecurityAuditEntry[]
  onViewEntry?: (entryId: string) => void
}

export default function AdminSecurityAuditLogCard({
  title,
  entries,
  onViewEntry,
}: AdminSecurityAuditLogCardProps) {
  return (
    <section
      className={`${ADMIN_SECURITY_CARD_SHELL} min-w-0`}
      style={{ boxShadow: ADMIN_SECURITY_CARD_SHADOW, fontFamily: ADMIN_SECURITY_FONT }}
      dir="rtl"
    >
      <h3 className="mb-3 text-right text-base font-bold text-[#0F172A]">{title}</h3>

      <div className="hidden min-w-0 overflow-hidden rounded-xl border border-[#E3F2FD] lg:block">
        <table className="w-full table-fixed border-collapse text-right">
          <colgroup>
            <col style={{ width: '24%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '28%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '16%' }} />
          </colgroup>
          <thead>
            <tr style={{ background: '#E8F4FD' }}>
              <th className="px-2 py-2.5 text-[11px] font-bold text-[#64748B] sm:px-3 sm:text-xs">
                الطابع الزمني
              </th>
              <th className="px-2 py-2.5 text-[11px] font-bold text-[#64748B] sm:px-3 sm:text-xs">
                الكيان
              </th>
              <th className="px-2 py-2.5 text-[11px] font-bold text-[#64748B] sm:px-3 sm:text-xs">
                نوع الحدث
              </th>
              <th className="px-2 py-2.5 text-[11px] font-bold text-[#64748B] sm:px-3 sm:text-xs">
                الحالة
              </th>
              <th className="px-2 py-2.5 text-center text-[11px] font-bold text-[#64748B] sm:px-3 sm:text-xs">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const tone = ADMIN_SECURITY_AUDIT_STATUS[entry.statusTone]
              return (
                <tr
                  key={entry.id}
                  className="border-t border-[#E3F2FD] bg-white last:border-b-0"
                >
                  <td className="truncate px-2 py-2.5 text-[11px] font-bold text-[#0F172A] sm:px-3 sm:text-xs">
                    {entry.timestamp}
                  </td>
                  <td className="truncate px-2 py-2.5 text-[11px] font-medium text-[#0F172A] sm:px-3 sm:text-xs">
                    {entry.entity}
                  </td>
                  <td className="truncate px-2 py-2.5 text-[11px] font-medium text-[#0F172A] sm:px-3 sm:text-xs">
                    {entry.eventType}
                  </td>
                  <td className="px-2 py-2.5 sm:px-3">
                    <span
                      className="inline-block max-w-full truncate rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{ background: tone.bg, color: tone.text }}
                    >
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-center sm:px-3">
                    <button
                      type="button"
                      onClick={() => onViewEntry?.(entry.id)}
                      className="inline-flex items-center justify-center text-[#2196F3]"
                      aria-label="عرض التفاصيل"
                    >
                      <ChevronLeft size={18} strokeWidth={2.5} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2.5 lg:hidden">
        {entries.map((entry) => {
          const tone = ADMIN_SECURITY_AUDIT_STATUS[entry.statusTone]
          return (
            <article
              key={entry.id}
              className="overflow-hidden rounded-xl border border-[#E3F2FD]"
            >
              <div className="px-3 py-2" style={{ background: '#E8F4FD' }}>
                <p className="text-xs font-bold text-[#64748B]">{entry.timestamp}</p>
              </div>
              <div className="space-y-2 bg-white p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 text-right">
                    <p className="text-xs font-bold text-[#0F172A]">{entry.entity}</p>
                    <p className="mt-0.5 text-[11px] font-medium text-[#0F172A]">
                      {entry.eventType}
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                    style={{ background: tone.bg, color: tone.text }}
                  >
                    {entry.status}
                  </span>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => onViewEntry?.(entry.id)}
                    className="text-[#2196F3]"
                    aria-label="عرض التفاصيل"
                  >
                    <ChevronLeft size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
