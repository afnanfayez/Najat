'use client'

import React from 'react'
import { Card } from '@/components/ui/card'

export default function HospitalWorkingHours() {
  return (
    <Card className="p-4 sm:p-5 rounded-[24px] border border-slate-100 shadow-md bg-white">
      <div className="flex items-center gap-2 mb-2">
        <img src="https://api.iconify.design/solar:clock-circle-bold.svg?color=%232196f3" alt="time" className="w-6 h-6" />
        <h3 className="text-xl font-black text-slate-800" style={{ fontFamily: "'Cairo', sans-serif" }}>ساعات العمل</h3>
      </div>
      <div className="bg-red-50 py-3 px-4 rounded-[16px] flex items-center justify-center gap-3 mb-6 w-full border border-red-100">
        <img src="https://api.iconify.design/solar:bell-bold.svg?color=%23ef4444" alt="emergency" className="w-7 h-7 flex-shrink-0" />
        <span className="text-[#EF4444] font-[900] text-[20px] text-center tracking-wide">قسم الطوارئ يعمل على مدار 24 ساعة</span>
      </div>
      <div className="flex flex-col font-bold text-[14px]">
        <div className="flex justify-between items-center px-1 mb-4">
          <span className="text-slate-800 font-black">السبت - الخميس (العيادات)</span>
          <span dir="ltr" className="text-slate-600">من 8:00 ص - 2:00 م</span>
        </div>
        
        <div className="flex justify-between items-center px-1 pb-4 mb-4 border-b border-slate-100">
          <span className="text-slate-800 font-black">الجمعة</span>
          <span dir="ltr" className="text-[#EF4444] font-black">مغلق (للطوارئ فقط)</span>
        </div>
        
        <div className="flex justify-between items-center px-1">
          <span className="text-slate-800 font-black">الصيدلية الخارجية</span>
          <span dir="ltr" className="text-slate-600">من 8:00 ص - 8:00 م</span>
        </div>
      </div>
    </Card>
  )
}
