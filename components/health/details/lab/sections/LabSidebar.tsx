'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import type { HealthFacility } from '@/schemas/healthFacility'
import LocationContactCard from '../../pharmacy/sections/LocationContactCard'
import type { LabeledIcon } from '@/schemas/healthFacilityDetail'

const FALLBACK_SUPPLIES: LabeledIcon[] = [
  { label: 'ابر سحب العينات', icon: 'https://api.iconify.design/solar:syringe-bold.svg?color=%23F2A122' },
  { label: 'مجاهر الفحص', icon: 'https://api.iconify.design/healthicons:microscope.svg?color=%23F2A122' },
  { label: 'انابيب سحب الدم', icon: 'https://api.iconify.design/solar:test-tube-bold.svg?color=%23F2A122' },
  { label: 'شرائح قياس', icon: 'https://api.iconify.design/solar:box-bold.svg?color=%23F2A122' },
]

const FALLBACK_HOURS = {
  rows: [
    { label: 'السبت-الخميس', time: '8:00ص-4:00م' },
    { label: 'الجمعة', time: '4:00م-11:00م' },
  ],
}

interface LabSidebarProps {
  lab: HealthFacility
}

export default function LabSidebar({ lab }: LabSidebarProps) {
  const supplies = lab.detail?.labSupplies?.length
    ? lab.detail.labSupplies
    : FALLBACK_SUPPLIES
  const hours = lab.detail?.labHours ?? FALLBACK_HOURS

  return (
    <div className="flex flex-col gap-6">
      
      <div className="hidden lg:block">
        <LocationContactCard facility={lab} />
      </div>

      <Card className="p-5 sm:p-6 rounded-[24px] border border-slate-100 shadow-sm bg-white flex flex-col">
        <div className="flex items-center gap-3 mb-4 sm:mb-5">
          <img src="https://api.iconify.design/solar:clock-circle-bold.svg?color=%232196f3" alt="time" className="w-5 h-5 sm:w-6 sm:h-6" />
          <h3 className="text-md sm:text-lg font-black text-slate-800">ساعات العمل</h3>
        </div>
        <div className="flex flex-col gap-4 sm:gap-5">
          {hours.rows.map((row, i) => (
            <div key={`${row.label}-${i}`} className="flex justify-between items-center text-[13px] sm:text-[14px]">
              <span className="text-slate-800 font-black">{row.label}</span>
              <span dir="ltr" className="text-slate-600 font-bold">{row.time}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 sm:p-6 rounded-[24px] border border-slate-100 shadow-sm bg-white flex flex-col">
        <div className="flex items-center gap-3 mb-4 sm:mb-5">
          <img src="https://api.iconify.design/healthicons:mask.svg?color=%232196f3" alt="icon" className="w-5 h-5 sm:w-6 sm:h-6" />
          <h3 className="text-md sm:text-lg font-black text-slate-800">المستلزمات الطبية</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {supplies.map((item, i) => (
            <div key={`${item.label}-${i}`} className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-50 bg-white gap-2 text-center shadow-sm">
              <img src={item.icon} alt={item.label} className="w-8 h-8" />
              <span className="text-[11px] sm:text-[12px] font-black text-slate-700 leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </Card>

    </div>
  )
}
