'use client'

import { useState } from 'react'
import type { AdminAidResponsePoint } from '@/schemas/adminAid'
import { ADMIN_AID_BLUE, ADMIN_AID_CARD_SHADOW, ADMIN_AID_FONT } from './adminAidStyles'

interface AdminAidResponseChartProps {
  weeklyData: AdminAidResponsePoint[]
  monthlyData?: AdminAidResponsePoint[]
}

function buildChartPath(
  values: number[],
  width: number,
  height: number,
  padding: number,
): string {
  const min = Math.min(...values) - 4
  const max = Math.max(...values) + 4
  const range = max - min || 1
  const stepX = (width - padding * 2) / (values.length - 1)

  const points = values.map((value, index) => {
    const x = padding + index * stepX
    const y = padding + (1 - (value - min) / range) * (height - padding * 2)
    return { x, y }
  })

  let path = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1]
    const curr = points[i]
    const cx = (prev.x + curr.x) / 2
    path += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`
  }
  return path
}

export default function AdminAidResponseChart({
  weeklyData,
  monthlyData,
}: AdminAidResponseChartProps) {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly')
  const data = period === 'weekly' ? weeklyData : (monthlyData ?? weeklyData)
  const values = data.map((item) => item.value)
  const width = 560
  const height = 180
  const padding = 16
  const hasData = values.length >= 2
  const linePath = hasData ? buildChartPath(values, width, height, padding) : ''
  const areaPath = hasData
    ? `${linePath} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`
    : ''

  return (
    <div
      className="flex h-full flex-col rounded-2xl border border-[#E8EEF5] bg-white p-4 sm:p-5"
      style={{ boxShadow: ADMIN_AID_CARD_SHADOW }}
      dir="rtl"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h2
          className="text-right text-base font-bold text-[#1E293B] sm:text-lg"
          style={{ fontFamily: ADMIN_AID_FONT }}
        >
          متوسط وقت الاستجابة
        </h2>
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#F1F5F9] p-1">
          {(['weekly', 'monthly'] as const).map((key) => {
            const active = period === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPeriod(key)}
                className="rounded-full px-3 py-1 text-xs font-bold transition-all"
                style={{
                  fontFamily: ADMIN_AID_FONT,
                  background: active ? ADMIN_AID_BLUE : 'transparent',
                  color: active ? '#fff' : '#64748B',
                }}
              >
                {key === 'weekly' ? 'أسبوعي' : 'شهري'}
              </button>
            )
          })}
        </div>
      </div>

      <div className="w-full flex-1 overflow-hidden">
        {!hasData && (
          <div className="flex h-full items-center justify-center text-sm text-[#94A3B8]">
            لا توجد بيانات
          </div>
        )}
        {hasData && <svg
          viewBox={`0 0 ${width} ${height + 28}`}
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-label="مخطط متوسط وقت الاستجابة"
        >
          <defs>
            <linearGradient id="aidChartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2196F3" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2196F3" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#aidChartFill)" />
          <path
            d={linePath}
            fill="none"
            stroke="#2196F3"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {data.map((item, index) => {
            const stepX = (width - padding * 2) / (values.length - 1)
            const x = padding + index * stepX
            return (
              <text
                key={item.day}
                x={x}
                y={height + 18}
                textAnchor="middle"
                className="fill-[#94A3B8] text-[11px] font-medium"
              >
                {item.day}
              </text>
            )
          })}
        </svg>}
      </div>
    </div>
  )
}
