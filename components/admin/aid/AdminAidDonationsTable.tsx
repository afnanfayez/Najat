'use client'

import { useState } from 'react'
import { Check, Pencil } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { AdminAidDonationRecord, DonationStatus } from '@/schemas/adminAid'
import {
  ADMIN_AID_BLUE,
  ADMIN_AID_FONT,
  ADMIN_AID_CARD_SHADOW,
  ADMIN_AID_INPUT_BG,
} from './adminAidStyles'

const STATUS_LABELS: Record<DonationStatus, { label: string; color: string; bg: string }> = {
  completed: { label: 'مكتمل', color: '#4CAF50', bg: '#E8F5E9' },
  processing: { label: 'قيد المعالجة', color: '#FF9800', bg: '#FFF3E0' },
}

const INPUT_CLASS =
  'h-9 w-full rounded-xl border-none pr-3 text-right text-sm shadow-none focus-visible:ring-0'

function formatAmount(value: number): string {
  return `$ ${value.toLocaleString('en-US')}`
}

interface AdminAidDonationsTableProps {
  donations: AdminAidDonationRecord[]
  onChange?: (donations: AdminAidDonationRecord[]) => void
}

function ToggleSwitch({
  active,
  onToggle,
}: {
  active: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
      style={{ background: active ? '#4CAF50' : '#EF4444' }}
    >
      <span
        className="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform"
        style={{
          transform: active ? 'translateX(-22px)' : 'translateX(-2px)',
        }}
      />
    </button>
  )
}

export default function AdminAidDonationsTable({
  donations,
  onChange,
}: AdminAidDonationsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  function updateRow(id: string, patch: Partial<AdminAidDonationRecord>) {
    onChange?.(
      donations.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    )
  }

  function toggleEdit(id: string) {
    setEditingId((current) => (current === id ? null : id))
  }

  function addRow() {
    const newRow: AdminAidDonationRecord = {
      id: `donation-${Date.now()}`,
      donorName: '',
      date: '',
      amount: 0,
      status: 'processing',
      active: true,
    }
    onChange?.([...donations, newRow])
    setEditingId(newRow.id)
  }

  return (
    <section dir="rtl">
      <div
        className="overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white"
        style={{ boxShadow: ADMIN_AID_CARD_SHADOW }}
      >
        <div className="flex flex-col gap-3 border-b border-[#E8EEF5] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
          <h2
            className="text-base font-bold text-[#1E293B] sm:text-lg"
            style={{ fontFamily: ADMIN_AID_FONT }}
          >
            سجل التبرعات الأخير
          </h2>
          <button
            type="button"
            onClick={addRow}
            className="w-full rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 sm:w-auto sm:py-2"
            style={{ background: ADMIN_AID_BLUE, fontFamily: ADMIN_AID_FONT }}
          >
            + إضافة صنف جديد
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-right">
            <thead>
              <tr className="border-b border-[#E8EEF5] bg-[#F8FAFC]">
                {['الجهة المانحة', 'التاريخ', 'المبلغ', 'الحالة', 'الإجراءات'].map(
                  (col) => (
                    <th
                      key={col}
                      className={`px-4 py-3 text-xs font-bold text-[#64748B] ${
                        col === 'الإجراءات' ? 'text-center' : ''
                      }`}
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
                const isEditing = editingId === row.id

                return (
                  <tr key={row.id} className="border-b border-[#E8EEF5] last:border-b-0">
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <Input
                          value={row.donorName}
                          onChange={(e) =>
                            updateRow(row.id, { donorName: e.target.value })
                          }
                          placeholder="الجهة المانحة"
                          className={INPUT_CLASS}
                          style={{ fontFamily: ADMIN_AID_FONT, background: ADMIN_AID_INPUT_BG }}
                          autoFocus
                        />
                      ) : (
                        <span
                          className="text-sm font-bold text-[#1E293B]"
                          style={{ fontFamily: ADMIN_AID_FONT }}
                        >
                          {row.donorName || '—'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <Input
                          value={row.date}
                          onChange={(e) => updateRow(row.id, { date: e.target.value })}
                          placeholder="12 أكتوبر 2023"
                          className={INPUT_CLASS}
                          style={{ fontFamily: ADMIN_AID_FONT, background: ADMIN_AID_INPUT_BG }}
                        />
                      ) : (
                        <span
                          className="text-sm text-[#64748B]"
                          style={{ fontFamily: ADMIN_AID_FONT }}
                        >
                          {row.date || '—'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <Input
                          type="number"
                          min={0}
                          value={row.amount}
                          onChange={(e) =>
                            updateRow(row.id, {
                              amount: Number(e.target.value) || 0,
                            })
                          }
                          className={INPUT_CLASS}
                          style={{ fontFamily: ADMIN_AID_FONT, background: ADMIN_AID_INPUT_BG }}
                        />
                      ) : (
                        <span
                          className="text-sm font-bold"
                          style={{ color: ADMIN_AID_BLUE, fontFamily: ADMIN_AID_FONT }}
                        >
                          {formatAmount(row.amount)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          value={row.status}
                          onChange={(e) =>
                            updateRow(row.id, {
                              status: e.target.value as DonationStatus,
                            })
                          }
                          className="h-9 w-full rounded-xl border-none px-3 text-right text-sm font-bold text-[#1E293B]"
                          style={{
                            fontFamily: ADMIN_AID_FONT,
                            background: ADMIN_AID_INPUT_BG,
                          }}
                        >
                          <option value="completed">مكتمل</option>
                          <option value="processing">قيد المعالجة</option>
                        </select>
                      ) : (
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
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          aria-label={isEditing ? 'حفظ' : 'تعديل'}
                          onClick={() => toggleEdit(row.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[#F1F5F9]"
                          style={{
                            color: isEditing ? ADMIN_AID_BLUE : '#64748B',
                            background: isEditing ? '#E3F2FD' : 'transparent',
                          }}
                        >
                          {isEditing ? (
                            <Check size={16} strokeWidth={2.5} />
                          ) : (
                            <Pencil size={16} />
                          )}
                        </button>
                        <ToggleSwitch
                          active={row.active}
                          onToggle={() =>
                            updateRow(row.id, { active: !row.active })
                          }
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
