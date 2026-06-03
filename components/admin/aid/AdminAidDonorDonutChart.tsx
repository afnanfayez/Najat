'use client'

import { ADMIN_AID_CARD_SHADOW, ADMIN_AID_FONT } from './adminAidStyles'

interface DonutSegment {
  label: string
  percent: number
  color: string
}

interface AdminAidDonorDonutChartProps {
  distribution: DonutSegment[]
}

function buildDonutSegments(segments: DonutSegment[]) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return segments.map((segment) => {
    const dash = (segment.percent / 100) * circumference
    const result = {
      ...segment,
      dash,
      offset,
      circumference,
    }
    offset += dash
    return result
  })
}

export default function AdminAidDonorDonutChart({
  distribution,
}: AdminAidDonorDonutChartProps) {
  const segments = buildDonutSegments(distribution)

  return (
    <div
      className="flex h-full min-h-[200px] flex-col rounded-2xl border border-[#E8EEF5] bg-white p-4 sm:p-5"
      style={{ boxShadow: ADMIN_AID_CARD_SHADOW }}
      dir="rtl"
    >
      <h3
        className="mb-4 text-right text-sm font-bold text-[#1E293B]"
        style={{ fontFamily: ADMIN_AID_FONT }}
      >
        توزيع التبرعات حسب النوع
      </h3>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#E8EEF5"
              strokeWidth="12"
            />
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
          <span
            className="absolute text-xl font-bold text-[#1E293B]"
            style={{ fontFamily: ADMIN_AID_FONT }}
          >
            100
          </span>
        </div>

        <ul className="space-y-2">
          {distribution.map((item) => (
            <li key={item.label} className="flex items-center justify-end gap-2">
              <span
                className="text-xs font-medium text-[#64748B]"
                style={{ fontFamily: ADMIN_AID_FONT }}
              >
                {item.label} ({item.percent}%)
              </span>
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ background: item.color }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
