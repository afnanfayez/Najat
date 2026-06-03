'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import SetupSectionCard from './SetupSectionCard'
import { SETUP_BLUE, SETUP_FONT, SETUP_INPUT_BG, SETUP_INPUT_CLASS } from './setupStyles'

interface StaffMember {
  id: string
  name: string
  role: string
  shift: string
}

interface MedicalStaffSectionProps {
  staff: StaffMember[]
  onRemove?: (id: string) => void
  onAdd?: (member: Omit<StaffMember, 'id'>) => void
}

const SHIFT_OPTIONS = ['الفترة الصباحية', 'الفترة المسائية', 'الفترة الليلية']

export default function MedicalStaffSection({
  staff,
  onRemove,
  onAdd,
}: MedicalStaffSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newShift, setNewShift] = useState(SHIFT_OPTIONS[0])

  function resetAddForm() {
    setShowAddForm(false)
    setNewName('')
    setNewRole('')
    setNewShift(SHIFT_OPTIONS[0])
  }

  function handleSubmitStaff() {
    if (!newName.trim() || !newRole.trim()) return
    onAdd?.({
      name: newName.trim(),
      role: newRole.trim(),
      shift: newShift,
    })
    resetAddForm()
  }

  return (
    <SetupSectionCard title="الطاقم الطبي المناوب">
      <div className="flex flex-1 flex-col">
        {staff.map((member) => (
          <div
            key={member.id}
            className="mt-3 flex items-start gap-3 rounded-xl bg-[#F8FAFC] p-3 first:mt-0"
            dir="ltr"
          >
            <button
              type="button"
              aria-label="حذف"
              onClick={() => onRemove?.(member.id)}
              className="mt-0.5 shrink-0 text-[#94A3B8] transition-colors hover:text-[#EF4444]"
            >
              <Trash2 size={16} />
            </button>

            <div className="min-w-0 flex-1 text-right" dir="rtl">
              <p
                className="text-sm font-bold text-[#1e293b]"
                style={{ fontFamily: SETUP_FONT }}
              >
                {member.name}
              </p>
              <p
                className="mt-0.5 text-xs text-[#64748B]"
                style={{ fontFamily: SETUP_FONT }}
              >
                {member.role} · {member.shift}
              </p>
            </div>
          </div>
        ))}

        {showAddForm && (
          <div
            className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#2196F3]/30 bg-[#F0F9FF] p-4"
            dir="rtl"
          >
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="اسم الطبيب"
              className={SETUP_INPUT_CLASS}
              style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
            />
            <Input
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="التخصص (مثل: طبيب طوارئ)"
              className={SETUP_INPUT_CLASS}
              style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
            />
            <select
              value={newShift}
              onChange={(e) => setNewShift(e.target.value)}
              className={`${SETUP_INPUT_CLASS} appearance-none`}
              style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
            >
              {SHIFT_OPTIONS.map((shift) => (
                <option key={shift} value={shift}>
                  {shift}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSubmitStaff}
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
          </div>
        )}
      </div>

      {!showAddForm && (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#CBD5E1] py-3 text-sm font-bold text-[#64748B] transition-colors hover:border-[#2196F3] hover:text-[#2196F3]"
          style={{ fontFamily: SETUP_FONT }}
        >
          <Plus size={16} />
          إضافة طبيب جديد
        </button>
      )}
    </SetupSectionCard>
  )
}
