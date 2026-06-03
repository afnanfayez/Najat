'use client'

import { Pencil } from 'lucide-react'
import type { AdminAidDonationRecord, DonationStatus } from '@/schemas/adminAid'
import { ADMIN_AID_BLUE, ADMIN_AID_FONT } from './adminAidStyles'

const STATUS_LABELS: Record<DonationStatus, { label: string; color: string; bg: string }> = {
  completed: { label: 'مكتمل', color: '#4CAF50', bg: '#E8F5E9' },
  processing: { label: 'قيد المعالجة', color: '#FF9800', bg: '#FFF3E0' },
}

function formatAmount(value: number): string {
  return `$ ${value.toLocaleString('en-US')}`
}

interface AdminAidDonationsTableProps {
  donations: AdminAidDonationRecord[]
  onAddCategory?: () => void
}

function ToggleSwitch({ active }: { active: boolean }) {
  return (
    <span
      className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
      style={{ background: active ? '#4CAF50' : '#EF4444' }}
    >
      <span
        className="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform"
        style={{
          transform: active ? 'translateX(-22px)' : 'translateX(-2px)',
        }}
      />
    </span>
  )
}

export default function AdminAidDonationsTable({
  donations,
  onAddCategory,
}: AdminAidDonationsTableProps) {
  return (
    <section dir="rtl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onAddCategory}
          className="rounded-xl px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: ADMIN_AID_BLUE, fontFamily: ADMIN_AID_FONT }}
        >
          + إضافة صنف جديد
        </button>
        <h2
          className="text-base font-bold text-[#1E293B] sm:text-lg"
          style={{ fontFamily: ADMIN_AID_FONT }}
        >
          سجل التبرعات الأخير
        </h2>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#E8EEF5] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <table className="w-full min-w-[640px] text-right">
          <thead>
            <tr className="border-b border-[#E8EEF5] bg-[#F8FAFC]">
              {['الجهة المانحة', 'التاريخ', 'المبلغ', 'الحالة', 'الإجراءات'].map(
                (col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-xs font-bold text-[#64748B]"
                    style={{ fontFamily: ADMIN_AID_FONT }}
                  >
                    {col}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {donations.map((row) => {
              const status = STATUS_LABELS[row.status]
              return (
                <tr key={row.id} className="border-b border-[#E8EEF5] last:border-b-0">
                  <td
                    className="px-4 py-4 text-sm font-medium text-[#1E293B]"
                    style={{ fontFamily: ADMIN_AID_FONT }}
                  >
                    {row.donorName}
                  </td>
                  <td
                    className="px-4 py-4 text-sm text-[#64748B]"
                    style={{ fontFamily: ADMIN_AID_FONT }}
                  >
                    {row.date}
                  </td>
                  <td
                    className="px-4 py-4 text-sm font-bold"
                    style={{ color: ADMIN_AID_BLUE, fontFamily: ADMIN_AID_FONT }}
                  >
                    {formatAmount(row.amount)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold"
                      style={{
                        fontFamily: ADMIN_AID_FONT,
                        color: status.color,
                        background: status.bg,
                      }}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        aria-label="تعديل"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F1F5F9]"
                      >
                        <Pencil size={16} />
                      </button>
                      <ToggleSwitch active={row.active} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
