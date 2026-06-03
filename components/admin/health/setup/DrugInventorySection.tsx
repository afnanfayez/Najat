'use client'

import { useState } from 'react'
import { Check, AlertTriangle, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import SetupSectionCard from './SetupSectionCard'
import type { DrugStatus } from './types'
import { SETUP_BLUE, SETUP_FONT, SETUP_INPUT_BG, SETUP_INPUT_CLASS } from './setupStyles'

interface DrugItem {
  id: string
  name: string
  subtitle: string
  status: DrugStatus
}

interface DrugInventorySectionProps {
  drugs: DrugItem[]
  onAdd?: (drug: Omit<DrugItem, 'id'>) => void
  onStatusChange?: (id: string, status: DrugStatus) => void
}

function StatusIconGroup({
  active,
  onSelect,
}: {
  active: DrugStatus
  onSelect: (status: DrugStatus) => void
}) {
  const items: { key: DrugStatus; Icon: typeof Check; color: string; bg: string }[] =
    [
      { key: 'unavailable', Icon: X, color: '#fff', bg: '#EF4444' },
      { key: 'low', Icon: AlertTriangle, color: '#fff', bg: '#F59E0B' },
      { key: 'available', Icon: Check, color: '#fff', bg: '#4CAF50' },
    ]

  return (
    <div className="flex shrink-0 items-center gap-2" dir="ltr">
      {items.map(({ key, Icon, color, bg }) => {
        const isActive = active === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-all"
            style={{
              background: isActive ? bg : 'transparent',
              color: isActive ? color : '#CBD5E1',
            }}
          >
            <Icon size={16} strokeWidth={2.5} />
          </button>
        )
      })}
    </div>
  )
}

export default function DrugInventorySection({
  drugs,
  onAdd,
  onStatusChange,
}: DrugInventorySectionProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newSubtitle, setNewSubtitle] = useState('')

  function resetAddForm() {
    setShowAddForm(false)
    setNewName('')
    setNewSubtitle('')
  }

  function handleSubmitDrug() {
    if (!newName.trim()) return
    onAdd?.({
      name: newName.trim(),
      subtitle: newSubtitle.trim() || 'عام',
      status: 'available',
    })
    resetAddForm()
  }

  return (
    <SetupSectionCard title="المخزون الدوائي">
      <ul className="flex flex-1 flex-col">
        {drugs.map((drug) => (
          <li
            key={drug.id}
            className="mt-3 flex items-center justify-between gap-3 rounded-full px-4 py-3 first:mt-0"
            style={{ background: '#E8F4FD' }}
            dir="rtl"
          >
            <div className="min-w-0 flex-1 text-right">
              <p
                className="text-sm font-bold text-[#1e293b]"
                style={{ fontFamily: SETUP_FONT }}
              >
                {drug.name}
              </p>
              <p
                className="mt-0.5 text-xs text-[#94A3B8]"
                style={{ fontFamily: SETUP_FONT }}
              >
                {drug.subtitle}
              </p>
            </div>

            <StatusIconGroup
              active={drug.status}
              onSelect={(status) => onStatusChange?.(drug.id, status)}
            />
          </li>
        ))}

        {showAddForm && (
          <li
            className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#2196F3]/30 bg-[#F0F9FF] p-4"
            dir="rtl"
          >
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="اسم الدواء"
              className={SETUP_INPUT_CLASS}
              style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
            />
            <Input
              value={newSubtitle}
              onChange={(e) => setNewSubtitle(e.target.value)}
              placeholder="التصنيف (مثل: عام)"
              className={SETUP_INPUT_CLASS}
              style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSubmitDrug}
                className="flex-1 rounded-xl py-2 text-sm font-bold text-white"
                style={{ fontFamily: SETUP_FONT, background: SETUP_BLUE }}
              >
                إضافة
              </button>
              <button
                type="button"
                onClick={resetAddForm}
                className="flex-1 rounded-xl border border-[#CBD5E1] py-2 text-sm font-bold text-[#64748B]"
                style={{ fontFamily: SETUP_FONT }}
              >
                إلغاء
              </button>
            </div>
          </li>
        )}
      </ul>

      {!showAddForm && (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="mt-4 flex w-full items-center justify-center rounded-full border-2 border-dashed py-3 text-sm font-bold transition-colors hover:opacity-80"
          style={{
            fontFamily: SETUP_FONT,
            borderColor: `${SETUP_BLUE}66`,
            color: SETUP_BLUE,
          }}
        >
          + إضافة دواء للمتابعة
        </button>
      )}
    </SetupSectionCard>
  )
}
