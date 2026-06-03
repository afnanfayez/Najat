'use client'

import { Clock, MapPin } from 'lucide-react'
import { ADMIN_MAPS_FONT } from './adminMapsStyles'

interface RouteModalLocationBarProps {
  areaName: string
  onAreaNameChange: (value: string) => void
  coordinates?: string
  lastUpdated?: string
}

export default function RouteModalLocationBar({
  areaName,
  onAreaNameChange,
  coordinates = '31.5017° N, 34.4668° E',
  lastUpdated = '24 مايو 2024 - 14:30',
}: RouteModalLocationBarProps) {
  return (
    <div
      className="mb-5 flex flex-col gap-4 rounded-2xl bg-[#EBF5FF] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:py-5"
      dir="rtl"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <div
          className="h-11 w-11 shrink-0 rounded-full bg-[#CBD5E1] sm:h-14 sm:w-14"
          aria-hidden
        />

        <div className="min-w-0 flex-1 text-right">
          <input
            type="text"
            value={areaName}
            onChange={(e) => onAreaNameChange(e.target.value)}
            placeholder="اسم المنطقة"
            aria-label="المنطقة"
            className="w-full border-none bg-transparent p-0 text-right text-sm font-bold text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus-visible:ring-0 sm:text-base"
            style={{ fontFamily: ADMIN_MAPS_FONT }}
          />
          <div className="mt-1 flex items-center justify-start gap-1.5">
            <MapPin size={16} className="shrink-0 text-[#2196F3]" strokeWidth={2.5} />
            <p
              className="break-all text-xs font-medium text-[#2196F3] sm:break-normal sm:text-sm"
              style={{ fontFamily: ADMIN_MAPS_FONT }}
              dir="ltr"
            >
              {coordinates}
            </p>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-[#CBD5E1]/40 pt-3 text-right sm:border-t-0 sm:pt-0">
        <p
          className="text-sm font-bold text-[#0F172A]"
          style={{ fontFamily: ADMIN_MAPS_FONT }}
        >
          آخر تحديث
        </p>
        <div className="mt-1 flex items-center justify-start gap-1.5">
          <Clock size={16} className="shrink-0 text-[#2196F3]" strokeWidth={2.5} />
          <p
            className="text-xs font-medium text-[#2196F3] sm:text-sm"
            style={{ fontFamily: ADMIN_MAPS_FONT }}
          >
            {lastUpdated}
          </p>
        </div>
      </div>
    </div>
  )
}
