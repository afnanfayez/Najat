'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import type { WorkingHoursBlock } from '@/schemas/healthFacilityDetail'

const FALLBACK: WorkingHoursBlock = {
  bannerText: 'قسم الطوارئ يعمل على مدار 24 ساعة',
  rows: [
    { label: 'السبت - الخميس (العيادات)', time: 'من 8:00 ص - 2:00 م' },
    { label: 'الجمعة', time: 'مغلق (للطوارئ فقط)', danger: true },
    { label: 'الصيدلية الخارجية', time: 'من 8:00 ص - 8:00 م' },
  ],
}

interface HospitalWorkingHoursProps {
  workingHours?: WorkingHoursBlock
}

export default function HospitalWorkingHours({
  workingHours,
}: HospitalWorkingHoursProps) {
  const block = workingHours?.rows?.length ? workingHours : FALLBACK

  return (
    <Card className="p-4 sm:p-5 rounded-[24px] border border-slate-100 shadow-md bg-white">
      <div className="flex items-center gap-2 mb-2">
        <img src="https://api.iconify.design/solar:clock-circle-bold.svg?color=%232196f3" alt="time" className="w-6 h-6" />
        <h3 className="text-xl font-black text-slate-800" style={{ fontFamily: "'Cairo', sans-serif" }}>ساعات العمل</h3>
      </div>
      {block.bannerText ? (
        <div className="bg-red-50 py-3 px-4 rounded-[16px] flex items-center justify-center gap-3 mb-6 w-full border border-red-100">
          <img src="https://api.iconify.design/solar:bell-bold.svg?color=%23ef4444" alt="emergency" className="w-7 h-7 flex-shrink-0" />
          <span className="text-[#EF4444] font-[900] text-[20px] text-center tracking-wide">{block.bannerText}</span>
        </div>
      ) : null}
      <div className="flex flex-col font-bold text-[14px]">
        {block.rows.map((row, i) => (
          <div
            key={`${row.label}-${i}`}
            className={`flex justify-between items-center px-1 ${i < block.rows.length - 1 ? 'mb-4 pb-4 border-b border-slate-100' : 'pb-1'}`}
          >
            <span className="text-slate-800 font-black">{row.label}</span>
            <span
              dir="ltr"
              className={row.danger ? 'text-[#EF4444] font-black' : 'text-slate-600'}
            >
              {row.time}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
