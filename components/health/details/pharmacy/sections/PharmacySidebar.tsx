'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import LocationContactCard from './LocationContactCard'

interface PharmacySidebarProps {
  pharmacy: any
}

export default function PharmacySidebar({ pharmacy }: PharmacySidebarProps) {
  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      
      {/* Location Card - Hidden on mobile, shown on desktop */}
      <div className="hidden lg:block">
        <LocationContactCard facility={pharmacy} />
      </div>

      {/* Working Hours Card */}
      <Card className="p-5 sm:p-6 rounded-[24px] border border-slate-100 shadow-sm bg-white flex flex-col">
        <div className="flex items-center gap-3 mb-4 sm:mb-5">
          <img src="https://api.iconify.design/solar:clock-circle-bold.svg?color=%232196f3" alt="time" className="w-5 h-5 sm:w-6 sm:h-6" />
          <h3 className="text-md sm:text-lg font-black text-slate-800">ساعات العمل</h3>
        </div>
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="flex justify-between items-center text-[13px] sm:text-[14px]">
            <span className="text-slate-800 font-black">السبت-الخميس</span>
            <span dir="ltr" className="text-slate-600 font-bold">8:00ص-10:00م</span>
          </div>
          <div className="flex justify-between items-center text-[13px] sm:text-[14px]">
            <span className="text-slate-800 font-black">الجمعة</span>
            <span dir="ltr" className="text-slate-600 font-bold">4:00م-11:00م</span>
          </div>
        </div>
      </Card>

      {/* Last Update Badge */}
      <div className="bg-[#FFCD2912] border border-[#FFCD2912] p-3 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <img src="https://api.iconify.design/solar:bell-bold.svg?color=%23FFCD29" alt="bell" className="w-4 h-4 flex-shrink-0" />
          <span className="text-[#FFCD29] font-black text-[11px] sm:text-[13px] whitespace-nowrap">آخر تحديث للبيانات منذ</span>
        </div>
        <span className="text-[#FFCD29] font-black text-[11px] sm:text-[13px]">29/3/2026</span>
      </div>

    </div>
  )
}
