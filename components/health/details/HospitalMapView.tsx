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
      {/* Full Screen Map Placeholder */}
      <div className="absolute inset-0 bg-[#e5e7eb]">
         <Image src="/assets/full_map_bg.png" alt="Map View" fill className="object-cover" />
         
         {/* Map Pins Placeholder */}
         <div className="absolute top-[30%] left-[40%]">
            <div className="relative">
               <div className="p-3 bg-white rounded-full shadow-xl border-4 border-blue-500 animate-pulse">
                  <MapPin size={32} className="text-blue-500" />
               </div>
               <div className="absolute top-[-40px] right-[-60px] bg-white px-4 py-2 rounded-xl shadow-lg border border-blue-100 flex items-center gap-2 whitespace-nowrap">
                  <span className="text-sm font-black text-slate-800">{hospital.name || "مستشفى أصدقاء المريض"}</span>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
               </div>
            </div>
         </div>
      </div>

      {/* Floating Header Actions */}
      <div className="absolute top-6 right-6 left-6 flex justify-between items-center pointer-events-none">
        <div 
          className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-blue-500 font-black cursor-pointer pointer-events-auto hover:bg-white transition-all"
          onClick={onBack}
        >
          <ArrowRight size={22} />
          <span>العودة للتفاصيل</span>
        </div>
      </div>

      {/* Bottom Floating Hospital Card */}
      <div className="absolute bottom-10 right-10 left-10 flex justify-center">
         <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-lg border-none shadow-2xl rounded-[32px] overflow-hidden flex h-32">
            <div className="relative w-1/3 h-full">
               <Image src="/assets/hospital_bg.png" alt="Hospital" fill className="object-cover" />
               <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent" />
            </div>
            <div className="flex-1 p-6 flex flex-col justify-center text-right">
               <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-amber-100 text-amber-600 border-none text-[10px] font-bold">قدرة استيعابية محدودة</Badge>
                  <span className="text-[10px] text-slate-400 font-bold">آخر تحديث منذ 15 دقيقة</span>
               </div>
               <h3 className="text-xl font-black text-slate-800 mb-1">{hospital.name || "مستشفى أصدقاء المريض"}</h3>
               <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                  <MapPin size={14} className="text-slate-400" />
                  <span>غزة - الرمال - شارع الشهداء</span>
               </div>
            </div>
            <div className="p-6 flex items-center">
               <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-200 cursor-pointer hover:bg-blue-600 transition-all">
                  <ChevronLeft size={24} />
               </div>
            </div>
         </Card>
      </div>

    </div>
  )
}
