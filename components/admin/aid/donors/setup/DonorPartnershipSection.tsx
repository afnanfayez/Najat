'use client'

import { Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import SetupSectionCard from '../../setup/SetupSectionCard'
import { ADMIN_AID_DONOR_FOCUS_AREAS } from '@/lib/mocks/adminAidMockData'
import type { AdminAidDonorDetail, DonorPartnershipStatus } from '@/schemas/adminAid'
import {
  SETUP_BLUE,
  SETUP_FONT,
  SETUP_INPUT_BG,
  SETUP_INPUT_CLASS,
  SETUP_LABEL_STYLE,
} from '../../setup/setupStyles'

const STATUS_OPTIONS: {
  id: DonorPartnershipStatus
  label: string
  color: string
  bg: string
  border: string
}[] = [
  {
    id: 'active',
    label: 'نشط',
    color: '#22C55E',
    bg: '#F0FDF4',
    border: '#BBF7D0',
  },
  {
    id: 'renewal',
    label: 'قيد التجديد',
    color: '#F59E0B',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
  {
    id: 'ended',
    label: 'منتهٍ',
    color: '#64748B',
    bg: '#F8FAFC',
    border: '#E2E8F0',
  },
]

interface DonorPartnershipSectionProps {
  form: AdminAidDonorDetail
  onChange: <K extends keyof AdminAidDonorDetail>(
    key: K,
    value: AdminAidDonorDetail[K],
  ) => void
}

export default function DonorPartnershipSection({
  form,
  onChange,
}: DonorPartnershipSectionProps) {
  function toggleFocusArea(area: string) {
    const next = form.focusAreas.includes(area)
      ? form.focusAreas.filter((a) => a !== area)
      : [...form.focusAreas, area]
    onChange('focusAreas', next)
  }

  return (
    <SetupSectionCard title="الشراكة والاتفاق">
      <div className="mb-5">
        <p
          className="mb-3 text-right text-sm font-bold text-[#0F172A]"
          style={{ fontFamily: SETUP_FONT }}
        >
          حالة الشراكة
        </p>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {STATUS_OPTIONS.map((opt) => {
            const selected = form.partnershipStatus === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange('partnershipStatus', opt.id)}
                className="rounded-xl border-2 px-1 py-2.5 text-[10px] font-bold transition-all sm:rounded-2xl sm:px-2 sm:py-3 sm:text-xs"
                style={{
                  fontFamily: SETUP_FONT,
                  background: selected ? opt.bg : '#fff',
                  borderColor: selected ? opt.color : opt.border,
                  color: selected ? opt.color : '#64748B',
                }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 text-right">
          <label style={SETUP_LABEL_STYLE}>بداية الاتفاق</label>
          <Input
            value={form.agreementStart}
            onChange={(e) => onChange('agreementStart', e.target.value)}
            placeholder="2022/01/01"
            className={SETUP_INPUT_CLASS}
            style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
          />
        </div>
        <div className="flex flex-col gap-2 text-right">
          <label style={SETUP_LABEL_STYLE}>نهاية الاتفاق</label>
          <Input
            value={form.agreementEnd}
            onChange={(e) => onChange('agreementEnd', e.target.value)}
            placeholder="2025/12/31"
            className={SETUP_INPUT_CLASS}
            style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
          />
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 text-right">
          <label style={SETUP_LABEL_STYLE}>إجمالي التبرعات ($)</label>
          <Input
            type="number"
            min={0}
            value={form.totalAmount || ''}
            onChange={(e) =>
              onChange('totalAmount', Number(e.target.value) || 0)
            }
            className={SETUP_INPUT_CLASS}
            style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
          />
        </div>
        <div className="flex flex-col gap-2 text-right">
          <label style={SETUP_LABEL_STYLE}>آخر تبرع</label>
          <Input
            value={form.lastDonation}
            onChange={(e) => onChange('lastDonation', e.target.value)}
            placeholder="12 أكتوبر 2023"
            className={SETUP_INPUT_CLASS}
            style={{ fontFamily: SETUP_FONT, background: SETUP_INPUT_BG }}
          />
        </div>
      </div>

      <div>
        <p
          className="mb-3 text-right text-sm font-bold text-[#0F172A]"
          style={{ fontFamily: SETUP_FONT }}
        >
          مجالات التركيز
        </p>
        <div className="flex flex-wrap justify-start gap-2">
          {ADMIN_AID_DONOR_FOCUS_AREAS.map((area) => {
            const selected = form.focusAreas.includes(area)
            return (
              <button
                key={area}
                type="button"
                onClick={() => toggleFocusArea(area)}
                className="flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold transition-all"
                style={{
                  fontFamily: SETUP_FONT,
                  background: selected ? SETUP_BLUE : '#F1F5F9',
                  color: selected ? '#fff' : '#64748B',
                }}
              >
                {selected && <Check size={12} strokeWidth={3} />}
                {area}
              </button>
            )
          })}
        </div>
      </div>
    </SetupSectionCard>
  )
}
