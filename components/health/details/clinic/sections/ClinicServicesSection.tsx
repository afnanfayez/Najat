'use client'

import React from 'react'
import { Card } from '@/components/ui/card'

const SERVICES = [
  { name: 'فحص عام', desc: 'كشف باطني عام', icon: 'https://api.iconify.design/solar:stethoscope-bold.svg?color=%23F2A122' },
  { name: 'التطعيمات', desc: 'اللقاحات الروتينية للاطفال', icon: 'https://api.iconify.design/solar:syringe-bold.svg?color=%23F2A122' },
  { name: 'متابعة الحمل', desc: 'متابعة الامومة والجنين', icon: 'https://api.iconify.design/healthicons:pregnant.svg?color=%23F2A122' },
  { name: 'تغيير الجروح', desc: 'تغيير وتنظيف وتعقيم الجروح', icon: 'https://api.iconify.design/solar:bandage-bold.svg?color=%23F2A122' },
  { name: 'متابعة امراض مزمنة', desc: 'السكري والضغط والقلب', icon: 'https://api.iconify.design/solar:heart-pulse-bold.svg?color=%23F2A122' },
  { name: 'متابعة الامراض التنفسية', desc: 'كشف ومتابعة لامراض الجهاز التنفسي', icon: 'https://api.iconify.design/solar:lungs-bold.svg?color=%23F2A122' },
]

export default function ClinicServicesSection() {
  return (
    <Card className="p-5 sm:p-7 xl:p-8 rounded-[24px] border border-slate-100 shadow-sm bg-white flex flex-col">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <img src="https://api.iconify.design/healthicons:medicines.svg?color=%232196f3" alt="icon" className="w-6 h-6" />
        <h3 className="text-lg sm:text-xl font-black text-slate-800">الفحوصات المتوفرة</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICES.map((service, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 bg-white hover:border-blue-50 transition-all cursor-default"
          >
            <img src={service.icon} alt={service.name} className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" />
            
            <div className="flex flex-col gap-0.5 overflow-hidden">
              <span className="text-[14px] sm:text-[15px] font-black text-slate-800 truncate">{service.name}</span>
              <span className="text-slate-400 text-[11px] font-bold truncate">{service.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
