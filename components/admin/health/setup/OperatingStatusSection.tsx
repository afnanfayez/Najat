'use client'

import { Ban, CheckCircle2, AlertTriangle } from 'lucide-react'
import SetupSectionCard from './SetupSectionCard'
import type { OperatingStatus } from './types'
import { SETUP_FONT } from './setupStyles'

const OPTIONS: {
  id: OperatingStatus
  label: string
  icon: typeof CheckCircle2
  color: string
  bg: string
  border: string
}[] = [
  {
    id: 'efficient',
    label: 'يعمل بكفاءة',
    icon: CheckCircle2,
    color: '#22C55E',
    bg: '#F0FDF4',
    border: '#BBF7D0',
  },
  {
    id: 'limited',
    label: 'خدمة محدودة',
    icon: AlertTriangle,
    color: '#F59E0B',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
  {
    id: 'closed',
    label: 'مغلق مؤقتاً',
    icon: Ban,
    color: '#EF4444',
    bg: '#FEF2F2',
    border: '#FECACA',
  },
]

interface OperatingStatusSectionProps {
  value: OperatingStatus
  onChange: (value: OperatingStatus) => void
}

export default function OperatingStatusSection({
  value,
  onChange,
}: OperatingStatusSectionProps) {
  return (
    <SetupSectionCard title="حالة التشغيل الحالية">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3 sm:items-stretch">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon
          const selected = value === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border-2 px-4 py-5 transition-all"
              style={{
                fontFamily: SETUP_FONT,
                background: selected ? opt.bg : '#fff',
                borderColor: selected ? opt.color : opt.border,
              }}
            >
              <Icon size={32} style={{ color: opt.color }} strokeWidth={2} />
              <span
                className="text-sm font-bold"
                style={{ color: selected ? opt.color : '#64748B' }}
              >
                {opt.label}
              </span>
            </button>
          )
        })}
      </div>
    </SetupSectionCard>
  )
}
