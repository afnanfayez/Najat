'use client'

import { useState } from 'react'
import { Check, Pencil } from 'lucide-react'
import { Input } from '@/components/ui/input'
import SetupSectionCard from './SetupSectionCard'
import type { AdminAidInventoryItem, InventoryItemStatus } from '@/schemas/adminAid'
import {
  SETUP_BLUE,
  SETUP_FONT,
  SETUP_INPUT_BG,
  SETUP_INPUT_CLASS,
} from './setupStyles'

const STATUS_LABELS: Record<
  InventoryItemStatus,
  { label: string; color: string; bg: string }
> = {
  available: { label: 'متوفر', color: '#4CAF50', bg: '#E8F5E9' },
  limited: { label: 'كمية محدودة', color: '#FF9800', bg: '#FFF3E0' },
  out: { label: 'نفذت الكمية', color: '#EF4444', bg: '#FEE2E2' },
}

interface InventoryTableSectionProps {
  items: AdminAidInventoryItem[]
  onChange: (items: AdminAidInventoryItem[]) => void
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

function formatQuantity(value: number): string {
  return value.toLocaleString('en-US')
}

export default function InventoryTableSection({
  items,
  onChange,
}: InventoryTableSectionProps) {
  const [page, setPage] = useState(1)
  const [editingId, setEditingId] = useState<string | null>(null)
  const pageSize = 5
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const pageItems = items.slice((page - 1) * pageSize, page * pageSize)
  const from = items.length === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, items.length)

  function updateItem(id: string, patch: Partial<AdminAidInventoryItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  function toggleEdit(id: string) {
    setEditingId((current) => (current === id ? null : id))
  }

  function addItem() {
    const newItem: AdminAidInventoryItem = {
      id: `item-${Date.now()}`,
      name: '',
      quantity: 0,
      unit: 'وحدة',
      expiryDate: '',
      status: 'available',
      active: true,
    }
    const nextItems = [...items, newItem]
    onChange(nextItems)
    const lastPage = Math.max(1, Math.ceil(nextItems.length / pageSize))
    setPage(lastPage)
    setEditingId(newItem.id)
  }

  function toggleActive(id: string) {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item,
      ),
    )
  }

  const addButton = (
    <button
      type="button"
      onClick={addItem}
      className="w-full rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 sm:w-auto sm:py-2"
      style={{ background: SETUP_BLUE, fontFamily: SETUP_FONT }}
    >
      + إضافة صنف جديد
    </button>
  )

  return (
    <SetupSectionCard title="مخزون المواد المتاحة" headerAction={addButton}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-right">
          <thead>
            <tr className="border-b border-[#E8EEF5] bg-[#F8FAFC]">
              {['الصنف', 'الكمية', 'الوحدة', 'تاريخ الانتهاء', 'الحالة', 'الإجراءات'].map(
                (col) => (
                  <th
                    key={col}
                    className={`px-4 py-3 text-xs font-bold text-[#64748B] ${
                      col === 'الإجراءات' ? 'text-center' : ''
                    }`}
                    style={{ fontFamily: SETUP_FONT }}
                  >
                    {col}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((item) => {
              const status = STATUS_LABELS[item.status]
              const isEditing = editingId === item.id

              return (
                <tr key={item.id} className="border-b border-[#E8EEF5] last:border-b-0">
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <Input
                        value={item.name}
                        onChange={(e) => updateItem(item.id, { name: e.target.value })}
                        placeholder="اسم الصنف"
                        className={`${SETUP_INPUT_CLASS} h-9`}
                        style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
                        autoFocus
                      />
                    ) : (
                      <span
                        className="text-sm font-bold text-[#1E293B]"
                        style={{ fontFamily: SETUP_FONT }}
                      >
                        {item.name || '—'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <Input
                        type="number"
                        min={0}
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(item.id, {
                            quantity: Number(e.target.value) || 0,
                          })
                        }
                        className={`${SETUP_INPUT_CLASS} h-9`}
                        style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
                      />
                    ) : (
                      <span
                        className="text-sm font-bold text-[#1E293B]"
                        style={{ fontFamily: SETUP_FONT }}
                      >
                        {formatQuantity(item.quantity)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <Input
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                        className={`${SETUP_INPUT_CLASS} h-9`}
                        style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
                      />
                    ) : (
                      <span
                        className="text-sm text-[#64748B]"
                        style={{ fontFamily: SETUP_FONT }}
                      >
                        {item.unit}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <Input
                        value={item.expiryDate}
                        onChange={(e) =>
                          updateItem(item.id, { expiryDate: e.target.value })
                        }
                        placeholder="2024/12/20"
                        className={`${SETUP_INPUT_CLASS} h-9`}
                        style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
                      />
                    ) : (
                      <span
                        className="text-sm text-[#64748B]"
                        style={{ fontFamily: SETUP_FONT }}
                      >
                        {item.expiryDate || '---'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <select
                        value={item.status}
                        onChange={(e) =>
                          updateItem(item.id, {
                            status: e.target.value as InventoryItemStatus,
                          })
                        }
                        className="h-9 w-full rounded-xl border-none px-3 text-right text-sm font-bold text-[#1E293B]"
                        style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
                      >
                        <option value="available">متوفر</option>
                        <option value="limited">كمية محدودة</option>
                        <option value="out">نفذت الكمية</option>
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
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        aria-label={isEditing ? 'حفظ' : 'تعديل'}
                        onClick={() => toggleEdit(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[#F1F5F9]"
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
                      <ToggleSwitch
                        active={item.active}
                        onToggle={() => toggleActive(item.id)}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3" dir="rtl">
        <p
          className="text-xs font-medium text-[#94A3B8]"
          style={{ fontFamily: SETUP_FONT }}
        >
          {items.length === 0
            ? 'لا توجد أصناف'
            : `عرض ${from} إلى ${to} من أصل ${items.length} جهة`}
        </p>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold transition-all"
              style={{
                fontFamily: SETUP_FONT,
                background: p === page ? SETUP_BLUE : 'transparent',
                color: p === page ? '#fff' : '#64748B',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </SetupSectionCard>
  )
}
