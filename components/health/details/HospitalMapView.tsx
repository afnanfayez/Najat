'use client'

import React from 'react'
import { ArrowRight, MapPin, Phone, AlertCircle, ChevronLeft } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface HospitalMapViewProps {
  hospital: any
  onBack: () => void
}

export default function HospitalMapView({ hospital, onBack }: HospitalMapViewProps) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif" }}>
      {/* ── Full Screen Map Placeholder ── */}
      <div className="absolute inset-0 bg-[#e5e7eb]">
        {/* If there is a real map, it goes here. For now, we use the image. */}
        <Image src="/assets/health5.jpg" alt="Map View" fill className="object-cover" />

        {/* Fake Markers to simulate the screenshot if needed */}
        <div className="absolute top-[35%] right-[25%] flex items-center gap-2">
          <img src="https://api.iconify.design/solar:map-point-bold.svg?color=%23f59e0b" alt="Location" className="w-6 h-6 drop-shadow-md" />
          <span className="text-amber-500 font-bold drop-shadow-md text-[15px]">غزة-الرمال-شارع الشهداء</span>
        </div>

        <div className="absolute top-[30%] right-[70%]">
          <div className="bg-[#2196F3] p-2 rounded-full border-[3px] border-white shadow-xl">
            <img src="https://api.iconify.design/solar:bag-bold.svg?color=white" alt="bag" className="w-5 h-5" />
          </div>
        </div>

        <div className="absolute top-[60%] right-[60%]">
          <div className="bg-slate-500 p-2 rounded-full border-[3px] border-white shadow-xl">
            <img src="https://api.iconify.design/solar:buildings-bold.svg?color=white" alt="building" className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── Top Right Back Button ── */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-slate-800 font-[900] text-[13px] sm:text-[15px] hover:text-blue-600 transition-colors bg-white/70 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md"
        >
          رجوع <ChevronLeft size={16} className="rotate-180 sm:w-[18px] sm:h-[18px]" />
        </button>
      </div>

      {/* ── Bottom Floating Hero Card ── */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-[calc(100%-2rem)] sm:w-[480px] xl:w-[580px] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.3)] border border-white/20 z-50">
        <div className="relative w-full h-[180px] sm:h-[220px] xl:h-[260px]">
          <Image src="/assets/health1.jpg" alt="Hospital" fill className="object-cover" />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
          
          {/* Content (Aligned bottom-right like the main Hero) */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 xl:bottom-8 xl:right-8 flex flex-col items-start text-white text-right">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
              <div className="bg-amber-500 text-white rounded-full font-black flex items-center gap-1 sm:gap-2 shadow-lg px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-[13px]">
                <AlertCircle size={12} className="sm:w-[14px] sm:h-[14px]" />
                قدرة استيعابية محدودة
              </div>
              <div className="bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full font-black shadow-lg px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-[13px]">
                آخر تحديث منذ 15 دقيقة
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 drop-shadow-md">
              <h1 className="font-black text-[18px] sm:text-[26px] xl:text-[32px] leading-tight tracking-wide">
                {hospital?.name || 'مستشفى أصدقاء المريض'}
              </h1>
            </div>
            
            <div className="flex items-center justify-start gap-1.5 sm:gap-2 text-[12px] sm:text-[14px] xl:text-[16px] font-bold text-slate-200 drop-shadow-md">
              <img src="https://api.iconify.design/solar:map-point-bold.svg?color=white" alt="Location" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{hospital?.address || 'غزة - الرمال - شارع الشهداء'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
