'use client'

import React from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Map, Phone } from 'lucide-react'
import type { HealthFacility } from '@/schemas/healthFacility'

interface LocationContactCardProps {
  facility: HealthFacility
}

export default function LocationContactCard({ facility }: LocationContactCardProps) {
  const mapSrc =
    facility.detail?.mapPreviewImageUrl ??
    facility.imageUrl ??
    '/assets/health5.jpg'
  const phone = facility.phone ?? '0592201453'

  return (
    <Card className="p-5 sm:p-6 rounded-[24px] border border-slate-100 shadow-sm bg-white flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <Map size={20} className="text-[#2196F3] sm:w-[22px] sm:h-[22px]" />
        <h3 className="text-md sm:text-lg font-black text-slate-800">الموقع والاتصال</h3>
      </div>
      <div className="relative w-full h-28 sm:h-32 rounded-2xl overflow-hidden mb-4 shadow-inner border border-slate-100 flex-shrink-0">
        <Image src={mapSrc} alt="معاينة الموقع" fill className="object-cover" />
      </div>
      <div className="flex flex-col gap-3 text-right">
        <div className="flex items-start gap-3 text-slate-700">
          <img src="https://api.iconify.design/solar:map-point-bold.svg?color=%23F2A122" alt="Location" className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="font-black text-[13px] sm:text-sm leading-relaxed">{facility.address}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-700">
          <Phone size={18} className="text-[#F2A122] flex-shrink-0 sm:w-[20px] sm:h-[20px]" />
          <span className="font-black text-[13px] sm:text-sm">{phone}</span>
        </div>
      </div>
    </Card>
  )
}
