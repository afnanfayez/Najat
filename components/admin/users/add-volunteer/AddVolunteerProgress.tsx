'use client'

import { FORM_AMBER, FORM_BLUE, FORM_FONT, STEP_NAMES, TOTAL_STEPS } from './types'

interface AddVolunteerProgressProps {
  step: number
}

export default function AddVolunteerProgress({ step }: AddVolunteerProgressProps) {
  const percent = Math.round((step / TOTAL_STEPS) * 100)

  return (
    <div className="mb-6">
      <div className="mb-1 flex items-center justify-between">
        <span
          className="text-sm font-bold"
          style={{ fontFamily: FORM_FONT, color: FORM_BLUE }}
        >
          تسجيل متطوع جديد
        </span>
        <span
          className="rounded-full px-3 py-0.5 text-xs font-bold text-white"
          style={{ background: '#4CAF50', fontFamily: FORM_FONT }}
        >
          {percent}% مكتمل
        </span>
      </div>

      <p className="mb-2 text-right text-sm font-semibold" style={{ fontFamily: FORM_FONT, color: FORM_AMBER }}>
        الخطوة {step} من {TOTAL_STEPS}: {STEP_NAMES[step - 1]}
      </p>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E8EEF5]">
        <div
          className="h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, background: FORM_AMBER }}
        />
      </div>
    </div>
  )
}
