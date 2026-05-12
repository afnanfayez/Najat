'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import type { HealthFacility } from '@/schemas/healthFacility'

interface PharmacyHeaderProps {
  pharmacy: HealthFacility
  onShowMap: () => void
}

export default function PharmacyHeader({ pharmacy, onShowMap }: PharmacyHeaderProps) {
  const kind = pharmacy.detail?.facilityKindLabel ?? 'صيدلية مركزية'
  const open = pharmacy.isOpen

  return (
    <Card className="p-4 sm:p-6 xl:p-8 rounded-[24px] border border-slate-100 shadow-sm bg-white flex flex-col items-start text-right relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 mb-2 sm:mb-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div
            className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-[13px] font-bold flex items-center gap-2 ${
              open
                ? 'bg-[#E7F7EF] text-[#22C55E]'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${open ? 'bg-[#22C55E]' : 'bg-slate-400'}`}
            />
            {open ? 'مفتوح الآن' : 'مغلق حالياً'}
          </div>
          <div className="text-slate-400 text-[11px] sm:text-[13px] font-bold">
            {kind}
          </div>
        </div>
        
        <button
          onClick={onShowMap}
          className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-4 sm:px-5 py-2 rounded-xl text-[12px] sm:text-[13px] font-bold transition-colors flex items-center gap-2 justify-center w-full sm:w-auto"
        >
          <img src="https://api.iconify.design/proicons:location.svg?color=white" alt="Map" className="w-4 h-4 sm:w-5 sm:h-5" />
          عرض الخريطة
        </button>
      </div>

      <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-black text-slate-800 mb-2 sm:mb-3">
        {pharmacy.name}
      </h1>

      <div className="flex items-center gap-2 text-slate-500 font-bold text-[13px] sm:text-[14px] xl:text-[16px] leading-relaxed">
        <img src="https://api.iconify.design/solar:map-point-bold.svg?color=%23f59e0b" alt="Location" className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
        <span>{pharmacy.address}</span>
      </div>
    </Card>
  )
}
