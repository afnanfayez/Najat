'use client'

import React from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Map, Phone, Clock } from 'lucide-react'

interface LabSidebarProps {
  lab: any
}

const SUPPLIES = [
  { label: 'ابر سحب العينات', icon: 'https://api.iconify.design/solar:syringe-bold.svg?color=%23F2A122' },
  { label: 'مجاهر الفحص', icon: 'https://api.iconify.design/healthicons:microscope.svg?color=%23F2A122' },
  { label: 'انابيب سحب الدم', icon: 'https://api.iconify.design/solar:test-tube-bold.svg?color=%23F2A122' },
  { label: 'شرائح قياس', icon: 'https://api.iconify.design/solar:box-bold.svg?color=%23F2A122' },
]

export default function LabSidebar({ lab }: LabSidebarProps) {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Location Card */}
      <Card className="p-5 sm:p-6 rounded-[24px] border border-slate-100 shadow-sm bg-white flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <Map size={20} className="text-[#2196F3] sm:w-[22px] sm:h-[22px]" />
          <h3 className="text-md sm:text-lg font-black text-slate-800">الموقع والاتصال</h3>
        </div>
        <div className="relative w-full h-28 sm:h-32 rounded-2xl overflow-hidden mb-4 shadow-inner border border-slate-100 flex-shrink-0">
          <Image src="/assets/health5.jpg" alt="Map Snippet" fill className="object-cover" />
        </div>
        <div className="flex flex-col gap-3 text-right">
          <div className="flex items-start gap-3 text-slate-700">
            <img src="https://api.iconify.design/solar:map-point-bold.svg?color=%23F2A122" alt="Location" className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="font-black text-[13px] sm:text-sm leading-relaxed">{lab?.address || 'مقابل مستشفى الشفاء-شارع الشفاء'}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700">
            <Phone size={18} className="text-[#F2A122] flex-shrink-0 sm:w-[20px] sm:h-[20px]" />
            <span className="font-black text-[13px] sm:text-sm">{lab?.phone || '0592201453'}</span>
          </div>
        </div>
      </Card>

      {/* Working Hours Card */}
      <Card className="p-5 sm:p-6 rounded-[24px] border border-slate-100 shadow-sm bg-white flex flex-col">
        <div className="flex items-center gap-3 mb-4 sm:mb-5">
          <img src="https://api.iconify.design/solar:clock-circle-bold.svg?color=%232196f3" alt="time" className="w-6 h-6" />
          <h3 className="text-md sm:text-lg font-black text-slate-800">ساعات العمل</h3>
        </div>
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="flex justify-between items-center text-[13px] sm:text-[14px]">
            <span className="text-slate-800 font-black">السبت-الخميس</span>
            <span dir="ltr" className="text-slate-600 font-bold">8:00ص-4:00م</span>
          </div>
          <div className="flex justify-between items-center text-[13px] sm:text-[14px]">
            <span className="text-slate-800 font-black">الجمعة</span>
            <span dir="ltr" className="text-slate-600 font-bold">4:00م-11:00م</span>
          </div>
        </div>
      </Card>

      {/* Medical Supplies Card */}
      <Card className="p-5 sm:p-6 rounded-[24px] border border-slate-100 shadow-sm bg-white flex flex-col">
        <div className="flex items-center gap-3 mb-4 sm:mb-5">
          <img src="https://api.iconify.design/healthicons:mask.svg?color=%232196f3" alt="icon" className="w-5 h-5 sm:w-6 sm:h-6" />
          <h3 className="text-md sm:text-lg font-black text-slate-800">المستلزمات الطبية</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {SUPPLIES.map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-50 bg-white gap-2 text-center shadow-sm">
              <img src={item.icon} alt={item.label} className="w-8 h-8" />
              <span className="text-[11px] sm:text-[12px] font-black text-slate-700 leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </Card>

    </div>
  )
}
