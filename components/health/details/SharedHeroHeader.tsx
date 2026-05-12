'use client'

import React from 'react'
import Image from 'next/image'
import { MapPin, TriangleAlert, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  CAPACITY_STATUS_LABEL,
  formatUpdatedRelative,
} from '@/lib/mappers/hospital'
import type { HealthFacility } from '@/schemas/healthFacility'

import '../health.css'

interface SharedHeroHeaderProps {
  hospital: HealthFacility
  onShowMap?: () => void
  onCall?: () => void
}

function badgeStylesForStatus(
  status: NonNullable<HealthFacility['capacityStatus']>,
): { main: string; secondary: string } {
  switch (status) {
    case 'available':
      return {
        main: 'border-emerald-400/50 bg-emerald-600/90 text-white',
        secondary: 'border-white/30 bg-white/15 text-white',
      }
    case 'full':
      return {
        main: 'border-orange-300/50 bg-amber-600/95 text-white',
        secondary: 'border-white/30 bg-white/15 text-white',
      }
    case 'critical':
      return {
        main: 'border-red-400/60 bg-red-700/95 text-white',
        secondary: 'border-white/30 bg-white/15 text-white',
      }
    default:
      return {
        main: 'border-amber-400/50 bg-amber-600/90 text-white',
        secondary: 'border-white/30 bg-white/15 text-white',
      }
  }
}

export default function SharedHeroHeader({
  hospital,
  onShowMap,
  onCall,
}: SharedHeroHeaderProps) {
  const cap = hospital.capacityStatus
  const detail = cap
    ? CAPACITY_STATUS_LABEL[cap].detail
    : 'قدرة استيعابية محدودة'
  const styles = cap ? badgeStylesForStatus(cap) : null
  const heroSrc = hospital.imageUrl || '/assets/health1.jpg'

  const handleCall = () => {
    const n = hospital.phone?.replace(/\s/g, '')
    if (n) {
      window.location.href = `tel:${n}`
      return
    }
    onCall?.()
  }

  const heroBg =
    heroSrc.startsWith('http://') || heroSrc.startsWith('https://') ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={heroSrc}
        alt={hospital.name}
        className="absolute inset-0 h-full w-full object-cover"
      />
    ) : (
      <Image
        src={heroSrc}
        alt={hospital.name}
        fill
        className="object-cover"
        priority
      />
    )

  return (
    <div className="shared-hero relative w-full overflow-hidden shadow-2xl flex-shrink-0">
      {heroBg}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

      <div className="shared-hero-content absolute flex flex-col items-start text-white text-right">
        <div className="flex flex-wrap items-center gap-2 mb-1 w-full">
          <div
            className={
              styles
                ? `shared-badge rounded-full font-black flex items-center gap-2 shadow-lg border ${styles.main}`
                : 'shared-badge bg-amber-500 text-white rounded-full font-black flex items-center gap-2 shadow-lg'
            }
          >
            <TriangleAlert size={14} />
            {detail}
          </div>
          <div
            className={
              styles
                ? `shared-badge rounded-full font-black shadow-lg border backdrop-blur-md ${styles.secondary}`
                : 'shared-badge bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full font-black shadow-lg'
            }
          >
            {hospital.updatedAt
              ? `آخر تحديث: ${formatUpdatedRelative(hospital.updatedAt)}`
              : 'آخر تحديث منذ لحظات'}
          </div>
        </div>
        <h1 className="shared-title font-black mb-1 drop-shadow-lg leading-tight">
          {hospital.name}
        </h1>
        <div className="shared-address flex items-center gap-2 font-bold drop-shadow-md">
          <img
            src="https://api.iconify.design/solar:map-point-bold.svg?color=white"
            alt="Location"
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
          <span>{hospital.address}</span>
        </div>
      </div>

      <div className="shared-hero-btns absolute flex items-center">
        <Button
          onClick={handleCall}
          type="button"
          className="shared-btn bg-white text-slate-800 hover:bg-slate-100 font-black rounded-2xl flex items-center gap-2 shadow-xl"
        >
          <Phone size={16} className="text-blue-500" />
          اتصال
        </Button>
        <Button
          type="button"
          onClick={onShowMap}
          className="shared-btn bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-500/30"
        >
          <MapPin size={16} />
          عرض الخريطة
        </Button>
      </div>
    </div>
  )
}
