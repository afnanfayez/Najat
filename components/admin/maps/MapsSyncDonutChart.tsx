'use client'

import type { AdminMapsIntegrity, AdminMapsSyncSegment } from '@/schemas/adminMaps'
import { ADMIN_MAPS_FONT } from './adminMapsStyles'

function buildDonutSegments(segments: AdminMapsSyncSegment[]) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return segments.map((segment) => {
    const dash = (segment.percent / 100) * circumference
    const result = { ...segment, dash, offset, circumference }
    offset += dash
    return result
  })
}

interface MapsSyncDonutChartProps {
  integrity: AdminMapsIntegrity
  size?: 'md' | 'lg'
}

export default function MapsSyncDonutChart({
  integrity,
  size = 'md',
}: MapsSyncDonutChartProps) {
  const segments = buildDonutSegments(integrity.syncSegments)
  const boxClass =
    size === 'lg'
      ? 'h-36 w-36 sm:h-40 sm:w-40'
      : 'h-32 w-32 sm:h-36 sm:w-36'

  return (
    <div className={`relative flex ${boxClass} items-center justify-center`}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#F1F5F9" strokeWidth="12" />
        {segments.map((segment) => (
          <circle
            key={segment.label}
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={segment.color}
            strokeWidth="12"
            strokeDasharray={`${segment.dash} ${segment.circumference - segment.dash}`}
            strokeDashoffset={-segment.offset}
            strokeLinecap="butt"
          />
        ))}
      </svg>
      <div className="absolute flex flex-col items-center text-center">
        <span
          className="text-xl font-bold text-[#0F172A] sm:text-2xl"
          style={{ fontFamily: ADMIN_MAPS_FONT }}
        >
          {integrity.syncPercent}%
        </span>
        <span
          className="mt-0.5 text-[10px] font-bold text-[#64748B] sm:text-xs"
          style={{ fontFamily: ADMIN_MAPS_FONT }}
        >
          حالة المزامنة
        </span>
      </div>
    </div>
  )
}
