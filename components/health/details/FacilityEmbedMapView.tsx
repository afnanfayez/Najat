'use client'

import React, { useMemo } from 'react'
import { ChevronLeft, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import FacilityLocationMap from '@/components/maps/FacilityLocationMap'
import {
  DEFAULT_HEALTH_MAP_LAT,
  DEFAULT_HEALTH_MAP_LON,
  googleMapsSearchUrl,
} from '@/lib/health/mapEmbed'
import type { HealthFacility } from '@/schemas/healthFacility'

export default function FacilityEmbedMapView({
  facility,
  onBack,
}: {
  facility: HealthFacility
  onBack: () => void
}) {
  const lat = facility.latitude ?? DEFAULT_HEALTH_MAP_LAT
  const lon = facility.longitude ?? DEFAULT_HEALTH_MAP_LON
  const mapsHref = useMemo(() => googleMapsSearchUrl(lat, lon), [lat, lon])
  const heroSrc = facility.imageUrl ?? '/assets/health5.jpg'
  const open = facility.isOpen
  const kind = facility.detail?.facilityKindLabel ?? 'منشأة صحية'

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif" }}
    >
      <div className="relative min-h-[45%] flex-1 bg-[#e5e7eb]">
        <FacilityLocationMap lat={lat} lng={lon} />

        <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2 sm:top-6 sm:right-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-slate-800 font-[900] text-[13px] sm:text-[15px] hover:text-blue-600 transition-colors bg-white/80 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md"
          >
            رجوع <ChevronLeft size={16} className="rotate-180 sm:w-[18px] sm:h-[18px]" />
          </button>
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-[12px] font-black text-white shadow-md hover:bg-emerald-700"
          >
            <ExternalLink size={14} />
            فتح في خرائط جوجل
          </a>
        </div>
      </div>

      <div className="relative z-10 w-full shrink-0 overflow-hidden rounded-t-[24px] border-t border-white/30 bg-white shadow-[0_-6px_28px_rgba(0,0,0,0.12)]">
        <div className="relative aspect-[16/7] w-full min-h-[140px] max-h-[220px] sm:aspect-[16/6] sm:max-h-[260px]">
          {heroSrc.startsWith('http://') || heroSrc.startsWith('https://') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            <Image src={heroSrc} alt="" fill className="object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

          <div className="absolute bottom-4 right-4 flex max-w-[calc(100%-2rem)] flex-col items-start gap-2 text-right text-white sm:bottom-6 sm:right-6">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <div
                className={`rounded-full px-2 py-0.5 text-[10px] font-black shadow-lg sm:px-3 sm:py-1 sm:text-[13px] ${
                  open ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-white'
                }`}
              >
                {open ? 'مفتوح' : 'مغلق'}
              </div>
              <div className="rounded-full border border-white/30 bg-white/20 px-2 py-0.5 text-[10px] font-black text-white shadow-lg backdrop-blur-md sm:px-3 sm:py-1 sm:text-[13px]">
                {kind}
              </div>
            </div>

            <div className="flex flex-col gap-1 drop-shadow-md">
              <h1 className="font-black text-[18px] leading-tight tracking-wide sm:text-[26px] xl:text-[32px]">
                {facility.name}
              </h1>
              <div className="flex items-center justify-start gap-1.5 text-[12px] font-bold text-slate-200 sm:text-[14px] xl:text-[16px]">
                <img
                  src="https://api.iconify.design/solar:map-point-bold.svg?color=white"
                  alt=""
                  className="h-4 w-4 sm:h-5 sm:w-5"
                />
                <span>{facility.address}</span>
              </div>
              {facility.distance ? (
                <span className="text-[12px] font-bold text-blue-200">
                  على بُعد {facility.distance}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
