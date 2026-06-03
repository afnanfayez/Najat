'use client'

import { CheckCircle2, AlertTriangle, Ban, Check } from 'lucide-react'
import AidEmbeddedMap from './AidEmbeddedMap'
import SetupSectionCard from './SetupSectionCard'
import { ADMIN_AID_TYPE_OPTIONS } from '@/lib/mocks/adminAidMockData'
import type { AdminAidDistributionPoint, DistributionPointStatus } from '@/schemas/adminAid'
import { SETUP_BLUE, SETUP_FONT } from './setupStyles'

const STATUS_OPTIONS: {
  id: DistributionPointStatus
  label: string
  icon: typeof CheckCircle2
  color: string
  bg: string
  border: string
}[] = [
  {
    id: 'open',
    label: 'مفتوح',
    icon: CheckCircle2,
    color: '#22C55E',
    bg: '#F0FDF4',
    border: '#BBF7D0',
  },
  {
    id: 'crowded',
    label: 'مزدحم',
    icon: AlertTriangle,
    color: '#F59E0B',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
  {
    id: 'closed',
    label: 'مغلق',
    icon: Ban,
    color: '#64748B',
    bg: '#F8FAFC',
    border: '#E2E8F0',
  },
]

interface StatusTypeSectionProps {
  form: AdminAidDistributionPoint
  onChange: <K extends keyof AdminAidDistributionPoint>(
    key: K,
    value: AdminAidDistributionPoint[K],
  ) => void
}

export default function StatusTypeSection({ form, onChange }: StatusTypeSectionProps) {
  function toggleAidType(type: string) {
    const next = form.aidTypes.includes(type)
      ? form.aidTypes.filter((t) => t !== type)
      : [...form.aidTypes, type]
    onChange('aidTypes', next)
  }

  return (
    <SetupSectionCard title="الحالة والنوع">
      <div className="mb-5">
        <p
          className="mb-3 text-right text-sm font-bold text-[#334155]"
          style={{ fontFamily: SETUP_FONT }}
        >
          حالة العمل الحالية
        </p>
        <div className="grid grid-cols-3 gap-2">
          {STATUS_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const selected = form.status === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange('status', opt.id)}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 px-2 py-4 transition-all"
                style={{
                  fontFamily: SETUP_FONT,
                  background: selected ? opt.bg : '#fff',
                  borderColor: selected ? opt.color : opt.border,
                }}
              >
                <Icon size={24} style={{ color: opt.color }} strokeWidth={2} />
                <span
                  className="text-xs font-bold"
                  style={{ color: selected ? opt.color : '#64748B' }}
                >
                  {opt.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-1">
        <p
          className="mb-3 text-right text-sm font-bold text-[#334155]"
          style={{ fontFamily: SETUP_FONT }}
        >
          أنواع المساعدات
        </p>
        <div className="flex flex-wrap justify-start gap-2">
          {ADMIN_AID_TYPE_OPTIONS.map((type) => {
            const selected = form.aidTypes.includes(type)
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleAidType(type)}
                className="flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold transition-all"
                style={{
                  fontFamily: SETUP_FONT,
                  background: selected ? SETUP_BLUE : '#F1F5F9',
                  color: selected ? '#fff' : '#64748B',
                }}
              >
                {selected && <Check size={12} strokeWidth={3} />}
                {type}
              </button>
            )
          })}
        </div>
      </div>

      <AidEmbeddedMap
        latitude={form.latitude}
        longitude={form.longitude}
        onLocationChange={({ latitude, longitude }) => {
          onChange('latitude', latitude)
          onChange('longitude', longitude)
        }}
      />
    </SetupSectionCard>
  )
}
