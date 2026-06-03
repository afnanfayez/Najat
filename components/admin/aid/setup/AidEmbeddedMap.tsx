'use client'

import dynamic from 'next/dynamic'
import { SETUP_BLUE, SETUP_FONT } from './setupStyles'

const FacilityLocationMapInner = dynamic(
  () =>
    import('../../health/setup/FacilityLocationMapInner').then(
      (mod) => mod.default,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-36 items-center justify-center bg-[#E8F4FD] text-sm font-bold text-[#2196F3]"
        style={{ fontFamily: SETUP_FONT }}
      >
        جاري تحميل الخريطة...
      </div>
    ),
  },
)

interface AidEmbeddedMapProps {
  latitude: number | null
  longitude: number | null
  onLocationChange: (location: { latitude: number; longitude: number }) => void
}

export default function AidEmbeddedMap({
  latitude,
  longitude,
  onLocationChange,
}: AidEmbeddedMapProps) {
  return (
    <div className="relative mt-5 overflow-hidden rounded-xl border border-[#E2E8F0]">
      <div className="h-36">
        <FacilityLocationMapInner
          latitude={latitude}
          longitude={longitude}
          onLocationChange={onLocationChange}
        />
      </div>
      <div className="absolute inset-x-0 bottom-3 flex justify-center px-3">
        <button
          type="button"
          className="rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md transition-opacity hover:opacity-90"
          style={{ background: SETUP_BLUE, fontFamily: SETUP_FONT }}
        >
          تحديد الموقع على الخريطة
        </button>
      </div>
    </div>
  )
}
