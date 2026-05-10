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
      <style dangerouslySetInnerHTML={{ __html: `
        /* Bottom card */
        .hmv-card { bottom: 2.5rem; right: 2.5rem; left: 2.5rem; }
        @media (max-width: 640px) { .hmv-card { bottom: 1rem; right: 0.75rem; left: 0.75rem; } }

        /* Card inner layout */
        .hmv-card-inner { height: 128px; }
        @media (max-width: 480px) { .hmv-card-inner { height: auto; flex-direction: column; } }

        /* Card image strip */
        .hmv-card-img { width: 33%; }
        @media (max-width: 480px) { .hmv-card-img { width: 100%; height: 120px; } }

        /* Back button */
        .hmv-back { top: 1.5rem; right: 1.5rem; left: 1.5rem; }
        @media (max-width: 640px) { .hmv-back { top: 0.75rem; right: 0.75rem; left: 0.75rem; } }
      `}} />

      {/* Full Screen Map Placeholder */}
      <div className="absolute inset-0 bg-[#e5e7eb]">
        <Image src="/assets/health5.jpg" alt="Map View" fill className="object-cover" />

        {/* Map Pin */}
        <div className="absolute top-[30%] left-[40%]">
          <div className="relative">
            <div className="p-3 bg-white rounded-full shadow-xl border-4 border-blue-500 animate-pulse">
              <MapPin size={28} className="text-blue-500" />
            </div>
            <div className="absolute top-[-40px] right-[-60px] bg-white px-3 py-1.5 rounded-xl shadow-lg border border-blue-100 flex items-center gap-2 whitespace-nowrap">
              <span className="text-xs font-black text-slate-800">{hospital.name || 'مستشفى شهداء الأقصى'}</span>
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Back Button */}
      <div className="hmv-back absolute flex justify-between items-center pointer-events-none">
        <div
          className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-blue-500 font-black cursor-pointer pointer-events-auto hover:bg-white transition-all text-sm"
          onClick={onBack}
        >
          <ArrowRight size={20} />
          <span>العودة للتفاصيل</span>
        </div>
      </div>

      {/* Bottom Floating Hospital Card */}
      <div className="hmv-card absolute flex justify-center">
        <Card className="hmv-card-inner w-full max-w-2xl bg-white/95 backdrop-blur-lg border-none shadow-2xl rounded-[28px] overflow-hidden flex">
          <div className="hmv-card-img relative h-full flex-shrink-0">
            <Image src="/assets/health1.jpg" alt="Hospital" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent" />
          </div>
          <div className="flex-1 p-5 flex flex-col justify-center text-right">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge className="bg-amber-100 text-amber-600 border-none text-[10px] font-bold">قدرة استيعابية محدودة</Badge>
              <span className="text-[10px] text-slate-400 font-bold">آخر تحديث منذ 15 دقيقة</span>
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">{hospital.name || 'مستشفى شهداء الأقصى'}</h3>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
              <MapPin size={13} className="text-slate-400" />
              <span>غزة - الرمال - شارع الشهداء</span>
            </div>
          </div>
          <div className="p-5 flex items-center flex-shrink-0">
            <div
              className="w-11 h-11 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-200 cursor-pointer hover:bg-blue-600 transition-all"
              onClick={onBack}
            >
              <ChevronLeft size={22} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
