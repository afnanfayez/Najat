'use client'

import { useState } from 'react'
import { Check, Pencil } from 'lucide-react'
import { Input } from '@/components/ui/input'
import SetupSectionCard from '../../setup/SetupSectionCard'
import type { AdminAidDonationRecord, DonationStatus } from '@/schemas/adminAid'
import {
  SETUP_BLUE,
  SETUP_FONT,
  SETUP_INPUT_BG,
} from '../../setup/setupStyles'

const STATUS_LABELS: Record<
  DonationStatus,
  { label: string; color: string; bg: string }
> = {
  completed: { label: 'مكتمل', color: '#4CAF50', bg: '#E8F5E9' },
  processing: { label: 'قيد المعالجة', color: '#FF9800', bg: '#FFF3E0' },
}

const INPUT_CLASS =
  'h-9 w-full rounded-xl border-none pr-3 text-right text-sm shadow-none focus-visible:ring-0'

interface DonorDonationsSectionProps {
  donations: AdminAidDonationRecord[]
  onChange: (donations: AdminAidDonationRecord[]) => void
}

export default function DonorDonationsSection({
  donations,
  onChange,
}: DonorDonationsSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  function updateRow(id: string, patch: Partial<AdminAidDonationRecord>) {
    onChange(
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
    onChange([...donations, newRow])
    setEditingId(newRow.id)
  }

  function formatAmount(value: number): string {
    return `$ ${value.toLocaleString('en-US')}`
  }

  const addButton = (
    <button
      type="button"
      onClick={addRow}
      className="rounded-xl px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
      style={{ background: SETUP_BLUE, fontFamily: SETUP_FONT }}
    >
      + إضافة تبرع
    </button>
  )

  return (
    <SetupSectionCard title="سجل تبرعات المانح" headerAction={addButton}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-right">
          <thead>
            <tr className="border-b border-[#E8EEF5] bg-[#F8FAFC]">
              {['التاريخ', 'المبلغ', 'الحالة', 'الإجراءات'].map((col) => (
                <th
                  key={col}
                  className={`px-4 py-3 text-xs font-bold text-[#64748B] ${
                    col === 'الإجراءات' ? 'text-center' : ''
                  }`}
                  style={{ fontFamily: SETUP_FONT }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {donations.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-sm text-[#94A3B8]"
                  style={{ fontFamily: SETUP_FONT }}
                >
                  لا توجد تبرعات مسجلة بعد
                </td>
              </tr>
            ) : (
              donations.map((row) => {
                const status = STATUS_LABELS[row.status]
                const isEditing = editingId === row.id
                return (
                  <tr key={row.id} className="border-b border-[#E8EEF5] last:border-b-0">
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <Input
                          value={row.date}
                          onChange={(e) => updateRow(row.id, { date: e.target.value })}
                          placeholder="12 أكتوبر 2023"
                          className={INPUT_CLASS}
                          style={{
                            fontFamily: SETUP_FONT,
                            background: SETUP_INPUT_BG,
                          }}
                        />
                      ) : (
                        <span
                          className="text-sm text-[#64748B]"
                          style={{ fontFamily: SETUP_FONT }}
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
                          style={{
                            fontFamily: SETUP_FONT,
                            background: SETUP_INPUT_BG,
                          }}
                        />
                      ) : (
                        <span
                          className="text-sm font-bold"
                          style={{ color: SETUP_BLUE, fontFamily: SETUP_FONT }}
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
                          className="h-9 w-full rounded-xl border-none px-3 text-right text-sm font-bold"
                          style={{
                            fontFamily: SETUP_FONT,
                            background: SETUP_INPUT_BG,
                          }}
                        >
                          <option value="completed">مكتمل</option>
                          <option value="processing">قيد المعالجة</option>
                        </select>
                      ) : (
                        <span
                          className="rounded-full px-3 py-1 text-xs font-bold"
                          style={{
                            fontFamily: SETUP_FONT,
                            color: status.color,
                            background: status.bg,
                          }}
                        >
                          {status.label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        aria-label={isEditing ? 'حفظ' : 'تعديل'}
                        onClick={() => toggleEdit(row.id)}
                        className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[#F1F5F9]"
                        style={{
                          color: isEditing ? SETUP_BLUE : '#64748B',
                          background: isEditing ? '#E3F2FD' : 'transparent',
                        }}
                      >
                        {isEditing ? (
                          <Check size={16} strokeWidth={2.5} />
                        ) : (
                          <Pencil size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </SetupSectionCard>
  )
}
