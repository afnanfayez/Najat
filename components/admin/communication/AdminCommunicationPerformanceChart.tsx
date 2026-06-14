'use client'

import { useState } from 'react'
import type { AdminCommunicationPerformancePoint } from '@/schemas/adminCommunication'
import {
  ADMIN_COMM_BLUE,
  ADMIN_COMM_CARD_SHADOW,
  ADMIN_COMM_FONT,
} from './adminCommunicationStyles'

interface AdminCommunicationPerformanceChartProps {
  weeklyData: AdminCommunicationPerformancePoint[]
  monthlyData: AdminCommunicationPerformancePoint[]
}

function buildChartPath(
  values: number[],
  width: number,
  height: number,
  padding: number
): string {
  if (values.length < 2) return ''
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

export default function AdminCommunicationPerformanceChart({
  weeklyData,
  monthlyData,
}: AdminCommunicationPerformanceChartProps) {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly')
  const data = period === 'weekly' ? weeklyData : monthlyData
  const values = data.map((item) => item.value)
  const width = 560
  const height = 110
  const padding = 12
  const linePath = buildChartPath(values, width, height, padding)
  const areaPath = linePath ? `${linePath} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z` : ''

  return (
    <section
      className="rounded-xl border border-[#E8EEF5] bg-white p-3 sm:p-4"
      style={{ boxShadow: ADMIN_COMM_CARD_SHADOW }}
      dir="rtl"
    >
      <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="text-right">
          <h2
            className="text-sm font-bold text-[#0F172A] sm:text-base"
            style={{ fontFamily: ADMIN_COMM_FONT }}
          >
            تحليل أداء الفرق الميدانية
          </h2>
          <p
            className="text-[11px] font-medium text-[#94A3B8] sm:text-xs"
            style={{ fontFamily: ADMIN_COMM_FONT }}
          >
            معدل الإنجاز مقابل الأهداف المخططة
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {(['weekly', 'monthly'] as const).map((key) => {
            const active = period === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPeriod(key)}
                className="text-xs font-bold transition-colors"
                style={{
                  fontFamily: ADMIN_COMM_FONT,
                  color: active ? '#F59E0B' : '#94A3B8',
                }}
              >
                {key === 'weekly' ? 'أسبوعي' : 'شهري'}
              </button>
            )
          })}
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height + 22}`}
          className="h-[100px] w-full sm:h-[110px]"
          preserveAspectRatio="xMidYMid meet"
          aria-label="تحليل أداء الفرق الميدانية"
        >
          <defs>
            <linearGradient id="commChartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ADMIN_COMM_BLUE} stopOpacity="0.22" />
              <stop offset="100%" stopColor={ADMIN_COMM_BLUE} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {areaPath && <path d={areaPath} fill="url(#commChartFill)" />}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke={ADMIN_COMM_BLUE}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
          {data.map((item, index) => {
            const stepX = (width - padding * 2) / (values.length - 1)
            const x = padding + index * stepX
            return (
              <text
                key={item.day}
                x={x}
                y={height + 14}
                textAnchor="middle"
                className="fill-[#94A3B8] text-[10px] font-medium"
              >
                {item.day}
              </text>
            )
          })}
        </svg>
      </div>
    </section>
  )
}
