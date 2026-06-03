'use client'

import AidTimeField from './AidTimeField'
import SetupSectionCard from './SetupSectionCard'
import { ADMIN_AID_WEEKDAYS } from '@/lib/mocks/adminAidMockData'
import type { AdminAidDistributionPoint } from '@/schemas/adminAid'
import {
  SETUP_BLUE,
  SETUP_FONT,
  SETUP_LABEL_STYLE,
} from './setupStyles'

interface ScheduleSectionProps {
  form: AdminAidDistributionPoint
  onChange: <K extends keyof AdminAidDistributionPoint>(
    key: K,
    value: AdminAidDistributionPoint[K],
  ) => void
}

export default function ScheduleSection({ form, onChange }: ScheduleSectionProps) {
  function toggleDay(day: number) {
    const next = form.workingDays.includes(day)
      ? form.workingDays.filter((d) => d !== day)
      : [...form.workingDays, day]
    onChange('workingDays', next.sort((a, b) => a - b))
  }

  return (
    <SetupSectionCard title="جدول التوزيع والمستفيدين">
      <div className="mb-5">
        <p
          className="mb-3 text-right text-sm font-bold text-[#334155]"
          style={{ fontFamily: SETUP_FONT }}
        >
          أيام العمل الأسبوعية
        </p>
        <div className="flex flex-wrap justify-start gap-2">
          {ADMIN_AID_WEEKDAYS.map((day) => {
            const selected = form.workingDays.includes(day.id)
            return (
              <button
                key={day.id}
                type="button"
                onClick={() => toggleDay(day.id)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition-all"
                style={{
                  fontFamily: SETUP_FONT,
                  background: selected ? SETUP_BLUE : '#F1F5F9',
                  color: selected ? '#fff' : '#94A3B8',
                }}
              >
                {day.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 text-right">
          <label style={SETUP_LABEL_STYLE}>ساعة البدء</label>
          <AidTimeField
            value={form.startTime}
            onChange={(v) => onChange('startTime', v)}
          />
        </div>
        <div className="flex flex-col gap-2 text-right">
          <label style={SETUP_LABEL_STYLE}>ساعة الانتهاء</label>
          <AidTimeField
            value={form.endTime}
            onChange={(v) => onChange('endTime', v)}
          />
        </div>
      </div>
    </SetupSectionCard>
  )
}
