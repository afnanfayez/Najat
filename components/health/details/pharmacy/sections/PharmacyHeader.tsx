'use client'

import React from 'react'
import { Card } from '@/components/ui/card'

interface PharmacyHeaderProps {
  pharmacy: any
  onShowMap: () => void
}

export default function PharmacyHeader({ pharmacy, onShowMap }: PharmacyHeaderProps) {
  return (
    <Card className="p-5 sm:p-6 rounded-[24px] border border-slate-100 shadow-sm bg-white flex flex-col items-start text-right relative">
      <div className="flex items-center justify-between w-full mb-3 sm:mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#E7F7EF] text-[#22C55E] px-4 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-[#22C55E] rounded-full" />
            مفتوح الآن
          </div>
          <div className="text-slate-400 text-[13px] font-bold">
            صيدلية مركزية
          </div>
        </div>
        
        <button
          onClick={onShowMap}
          className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-5 py-2 rounded-xl text-[13px] font-bold transition-colors flex items-center gap-2"
        >
          <img src="https://api.iconify.design/proicons:location.svg?color=white" alt="Map" className="w-5 h-5" />
          عرض الخريطة
        </button>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-3">
        {pharmacy?.name || 'صيدلية ألما فارما-غزة'}
      </h1>

      <div className="flex items-center gap-2 text-slate-500 font-bold text-[14px] sm:text-[15px]">
        <img src="https://api.iconify.design/solar:map-point-bold.svg?color=%23f59e0b" alt="Location" className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>{pharmacy?.address || 'غزة-الرمال-مقابل مرطبات كاظم-شارع خالد بن الوليد'}</span>
      </div>
    </Card>
  )
}
