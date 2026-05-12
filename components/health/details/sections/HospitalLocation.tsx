'use client'

import React from 'react'
import Image from 'next/image'
import { Map, Phone } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { HealthFacility } from '@/schemas/healthFacility'

interface HospitalLocationProps {
  hospital: HealthFacility
}

export default function HospitalLocation({ hospital }: HospitalLocationProps) {
  const mapSrc =
    hospital.detail?.mapPreviewImageUrl ?? hospital.imageUrl ?? '/assets/health5.jpg'
  const phone = hospital.phone ?? '0595188009'

  return (
    <Card className="hdv-location-card p-5 rounded-[28px] border-2 border-slate-100 shadow-md bg-white flex flex-col">
      <div className="flex items-center gap-3 mb-3 flex-shrink-0">
        <Map size={22} className="text-[#2196F3]" />
        <h3 className="text-lg font-black text-slate-800">الموقع والاتصال</h3>
      </div>
      <div className="relative w-full h-32 rounded-2xl overflow-hidden mb-4 shadow-inner border border-slate-100 flex-shrink-0">
        <Image src={mapSrc} alt="معاينة الموقع" fill className="object-cover" />
      </div>
      <div className="flex flex-col gap-3 text-right">
        <div className="flex items-center gap-3 text-slate-700">
          <img src="https://api.iconify.design/solar:map-point-bold.svg?color=%23F2A122" alt="Location" className="w-5 h-5 flex-shrink-0" />
          <span className="font-black text-sm">{hospital.address}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-700">
          <Phone size={20} className="text-[#F2A122] flex-shrink-0" />
          <span className="font-black text-sm">{phone}</span>
        </div>
      </div>
    </Card>
  )
}
