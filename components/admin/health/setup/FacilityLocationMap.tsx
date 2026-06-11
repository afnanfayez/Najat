'use client'

import dynamic from 'next/dynamic'
import SetupSectionCard from './SetupSectionCard'
import { SETUP_FONT } from './setupStyles'

const FacilityLocationMapInner = dynamic(
  () => import('./FacilityLocationMapInner'),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-[11rem] flex-1 items-center justify-center rounded-xl bg-[#E8F4FD] text-sm font-bold text-[#2196F3]"
        style={{ fontFamily: SETUP_FONT }}
      >
        جاري تحميل الخريطة...
      </div>
    ),
  },
)

interface FacilityLocationMapInnerProps {
  latitude: number | null
  longitude: number | null
  onLocationChange: (location: { latitude: number; longitude: number }) => void
}

interface FacilityLocationMapProps extends FacilityLocationMapInnerProps {
  className?: string
}

function formatCoordinates(lat: number, lng: number) {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
}

function LocationHint({ hasLocation }: { hasLocation: boolean }) {
  return (
    <p
      className="mt-2 text-right text-xs text-[#64748B]"
      style={{ fontFamily: SETUP_FONT }}
    >
      {hasLocation
        ? 'اسحب الدبوس لضبط الموقع بدقة، أو انقر على الخريطة لتغييره'
        : 'انقر على الخريطة لتحديد موقع المنشأة'}
    </p>
  )
}

export default function FacilityLocationMap({
  className = '',
  latitude,
  longitude,
  onLocationChange,
}: FacilityLocationMapProps) {
  const hasLocation = latitude != null && longitude != null

  return (
    <SetupSectionCard title="الموقع الجغرافي" className={className}>
      <div className="flex min-h-[11rem] flex-1 flex-col overflow-hidden rounded-xl border border-[#E2E8F0]">
        <FacilityLocationMapInner
          latitude={latitude}
          longitude={longitude}
          onLocationChange={onLocationChange}
        />
      </div>

      {hasLocation && (
        <p
          className="mt-2 text-right text-xs font-bold text-[#334155]"
          style={{ fontFamily: SETUP_FONT }}
          dir="ltr"
        >
          {formatCoordinates(latitude, longitude)}
        </p>
      )}

      <LocationHint hasLocation={hasLocation} />
    </SetupSectionCard>
  )
}
