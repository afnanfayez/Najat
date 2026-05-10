'use client'

import React from 'react'
import Image from 'next/image'
import { MapPin, TriangleAlert, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

import '../health.css'

interface SharedHeroHeaderProps {
  hospital: any
  onShowMap?: () => void
  onCall?: () => void
}

export default function SharedHeroHeader({ hospital, onShowMap, onCall }: SharedHeroHeaderProps) {
  return (
    <div className="shared-hero relative w-full overflow-hidden shadow-2xl flex-shrink-0">
      <Image src="/assets/health1.jpg" alt="Hospital Header" fill className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

      <div className="shared-hero-content absolute flex flex-col items-start text-white text-right">
        <div className="flex flex-wrap items-center gap-2 mb-1 w-full">
          <div className="shared-badge bg-amber-500 text-white rounded-full font-black flex items-center gap-2 shadow-lg">
            <TriangleAlert size={14} />
            قدرة استيعابية محدودة
          </div>
          <div className="shared-badge bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full font-black shadow-lg">
            آخر تحديث منذ 15 دقيقة
          </div>
        </div>
        <h1 className="shared-title font-black mb-1 drop-shadow-lg leading-tight">{hospital?.name || 'مستشفى شهداء الأقصى'}</h1>
        <div className="shared-address flex items-center gap-2 font-bold drop-shadow-md">
          <img src="https://api.iconify.design/solar:map-point-bold.svg?color=white" alt="Location" className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>{hospital?.address || 'غزة - الرمال - شارع الشهداء'}</span>
        </div>
      </div>

      <div className="shared-hero-btns absolute flex items-center">
        <Button onClick={onCall} className="shared-btn bg-white text-slate-800 hover:bg-slate-100 font-black rounded-2xl flex items-center gap-2 shadow-xl">
          <Phone size={16} className="text-blue-500" />
          اتصال
        </Button>
        <Button onClick={onShowMap} className="shared-btn bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-500/30">
          <MapPin size={16} />
          عرض الخريطة
        </Button>
      </div>
    </div>
  )
}
