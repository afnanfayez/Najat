'use client'

import React from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Map, Phone, Clock, Bell } from 'lucide-react'

interface PharmacySidebarProps {
  pharmacy: any
}

export default function PharmacySidebar({ pharmacy }: PharmacySidebarProps) {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Location Card */}
      <Card className="p-6 rounded-[24px] border border-slate-100 shadow-sm bg-white flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <Map size={22} className="text-[#2196F3]" />
          <h3 className="text-lg font-black text-slate-800">الموقع والاتصال</h3>
        </div>
        <div className="relative w-full h-32 rounded-2xl overflow-hidden mb-4 shadow-inner border border-slate-100 flex-shrink-0">
          <Image src="/assets/health5.jpg" alt="Map Snippet" fill className="object-cover" />
        </div>
        <div className="flex flex-col gap-3 text-right">
          <div className="flex items-center gap-3 text-slate-700">
            <img src="https://api.iconify.design/solar:map-point-bold.svg?color=%23F2A122" alt="Location" className="w-5 h-5 flex-shrink-0" />
            <span className="font-black text-sm">{pharmacy?.address || 'غزة-الرمال-مقابل مرطبات كاظم-شارع خالد بن الوليد'}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700">
            <Phone size={20} className="text-[#F2A122] flex-shrink-0" />
            <span className="font-black text-sm">{pharmacy?.phone || '0592201453'}</span>
          </div>
        </div>
      </Card>

      {/* Working Hours Card */}
      <Card className="p-6 rounded-[24px] border border-slate-100 shadow-sm bg-white flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <Clock size={22} className="text-[#2196F3]" />
          <h3 className="text-lg font-black text-slate-800">ساعات العمل</h3>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center text-[14px]">
            <span className="text-slate-800 font-black">السبت-الخميس</span>
            <span dir="ltr" className="text-slate-600 font-bold">من 8:00ص-10:00م</span>
          </div>
          <div className="flex justify-between items-center text-[14px]">
            <span className="text-slate-800 font-black">الجمعة</span>
            <span dir="ltr" className="text-slate-600 font-bold">من 4:00م-11:00م</span>
          </div>
        </div>
      </Card>

      {/* Last Update Badge */}
      <div className="bg-[#fff9e6] border border-[#fef3c7] p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <img src="https://api.iconify.design/solar:bell-bold.svg?color=%23f59e0b" alt="bell" className="w-5 h-5" />
          <span className="text-[#f59e0b] font-black text-[14px]">آخر تحديث للبيانات منذ</span>
        </div>
        <span className="text-[#f59e0b] font-black text-[14px]">29/3/2026</span>
      </div>

    </div>
  )
}
