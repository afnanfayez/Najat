'use client'

import type {
  AdminReportsResourceBreakdown,
  AdminReportsResourceSegment,
} from '@/schemas/adminReports'
import {
  ADMIN_REPORTS_CARD_SHELL,
  ADMIN_REPORTS_CARD_SHADOW,
  ADMIN_REPORTS_FONT,
} from './adminReportsStyles'

interface AdminReportsResourceDonutCardProps {
  data: AdminReportsResourceBreakdown
  layout?: 'horizontal' | 'vertical'
}

function buildDonutSegments(segments: AdminReportsResourceSegment[]) {
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

export default function AdminReportsResourceDonutCard({
  data,
  layout = 'horizontal',
}: AdminReportsResourceDonutCardProps) {
  const segments = buildDonutSegments(data.segments)

  const chartSize = layout === 'vertical' ? 'h-36 w-36 sm:h-40 sm:w-40' : 'h-28 w-28 sm:h-32 sm:w-32'

  const legend = (
    <div
      className={
        layout === 'vertical'
          ? 'flex w-full min-w-0 flex-col items-center gap-2.5 text-center sm:items-start sm:text-right'
          : 'flex w-full min-w-0 flex-col gap-2 sm:w-auto'
      }
    >
      {data.segments.map((segment) => (
        <div key={segment.label} className="flex items-center justify-start gap-2">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: segment.color }}
          />
          {layout === 'vertical' ? (
            <span className="min-w-0 break-words text-xs font-bold text-[#0F172A] sm:text-sm">
              {segment.label} {segment.percent}%
            </span>
          ) : (
            <>
              <span className="text-sm font-bold" style={{ color: segment.color }}>
                {segment.percent}%
              </span>
              <span className="text-sm font-bold text-[#0F172A]">{segment.label}</span>
            </>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <section
      className={`${ADMIN_REPORTS_CARD_SHELL} flex h-full flex-col`}
      style={{ boxShadow: ADMIN_REPORTS_CARD_SHADOW, fontFamily: ADMIN_REPORTS_FONT }}
      dir="rtl"
    >
      {layout === 'vertical' ? (
        <div className="flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 py-2 sm:items-start sm:gap-5">
          <div className={`relative flex shrink-0 items-center justify-center ${chartSize}`}>
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
                />
              ))}
            </svg>
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-2xl font-bold text-[#0F172A] sm:text-3xl">
                {data.totalValue}
              </span>
            </div>
          </div>
          {legend}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between">
          <div className={`relative flex shrink-0 items-center justify-center ${chartSize}`}>
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
                />
              ))}
            </svg>
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-xl font-bold text-[#0F172A] sm:text-2xl">
                {data.totalValue}
              </span>
              <span className="text-[10px] font-bold text-[#64748B] sm:text-xs">
                {data.totalLabel}
              </span>
            </div>
          </div>
          {legend}
        </div>
      )}
    </section>
  )
}
