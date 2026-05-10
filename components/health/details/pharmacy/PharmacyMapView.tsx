'use client'

import React from 'react'
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'

interface PharmacyMapViewProps {
  pharmacy: any
  onBack: () => void
}

export default function PharmacyMapView({ pharmacy, onBack }: PharmacyMapViewProps) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif" }}>
      
      <div className="absolute inset-0 bg-[#e5e7eb]">
        <Image src="/assets/health5.jpg" alt="Map View" fill className="object-cover" />

        {/* Marker */}
        <div className="absolute top-[35%] right-[25%] flex items-center gap-2">
          <img src="https://api.iconify.design/proicons:location.svg?color=%23f59e0b" alt="Location" className="w-8 h-8 drop-shadow-md" />
          <span className="text-amber-500 font-bold drop-shadow-md text-[16px]">{pharmacy?.name || 'صيدلية النجاة'}</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-slate-800 font-[900] text-[13px] sm:text-[15px] hover:text-blue-600 transition-colors bg-white/70 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md"
        >
          رجوع <ChevronLeft size={16} className="rotate-180 sm:w-[18px] sm:h-[18px]" />
        </button>
      </div>

      {/* Floating Pharmacy Header Card */}
      <div className="absolute bottom-6 left-4 sm:left-8 w-[calc(100%-2rem)] sm:w-[480px] xl:w-[580px] bg-white rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] p-6 sm:p-8 z-50 border border-slate-100">
        <div className="flex items-center gap-3 mb-4 w-full justify-start">
          <div className="bg-[#E7F7EF] text-[#22C55E] px-4 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-[#22C55E] rounded-full" />
            مفتوح الآن
          </div>
          <div className="text-slate-400 text-[13px] font-bold">
            صيدلية مركزية
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-3">
          {pharmacy?.name || 'صيدلية النجاة المركزية'}
        </h1>

        <div className="flex items-center gap-2 text-slate-500 font-bold text-[15px] sm:text-[17px]">
          <img src="https://api.iconify.design/proicons:location.svg?color=%23f59e0b" alt="Location" className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>{pharmacy?.address || 'شارع الوحدة - غزة'}</span>
        </div>
      </div>
    </div>
  )
}
