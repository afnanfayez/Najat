'use client'

import React from 'react'
import { Card } from '@/components/ui/card'

const SUPPLIES = [
  { label: 'كمامات جراحية', icon: 'https://api.iconify.design/healthicons:mask.svg?color=%23f59e0b' },
  { label: 'اسطوانات اكسجين', icon: 'https://api.iconify.design/healthicons:oxygen-tank.svg?color=%23f59e0b' },
  { label: 'موازين حرارة', icon: 'https://api.iconify.design/healthicons:thermometer.svg?color=%23f59e0b' },
  { label: 'ميزان', icon: 'https://api.iconify.design/solar:scale-bold.svg?color=%23f59e0b' },
  { label: 'قفازات طبية', icon: 'https://api.iconify.design/healthicons:ppe-gloves.svg?color=%23f59e0b' },
  { label: 'اجهزة قياس الضغط', icon: 'https://api.iconify.design/healthicons:blood-pressure.svg?color=%23f59e0b' },
]

export default function PharmacyMedicalSupplies() {
  return (
    <Card className="p-5 sm:p-7 xl:p-8 rounded-[24px] border border-slate-100 shadow-sm bg-white flex flex-col">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <img src="https://api.iconify.design/healthicons:mask.svg?color=%232196f3" alt="icon" className="w-5 h-5 sm:w-6 sm:h-6" />
        <h3 className="text-lg sm:text-xl font-black text-slate-800">المستلزمات الطبية</h3>
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
        {SUPPLIES.map((supply, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-[18px] border-2 border-slate-50 bg-white hover:border-blue-100 transition-all cursor-default text-center gap-2 shadow-sm"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mb-1">
              <img src={supply.icon} alt={supply.label} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
            </div>
            <span className="text-[12px] sm:text-[14px] font-black text-slate-700 leading-tight">{supply.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
