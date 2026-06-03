'use client'

import type { AdminHealthStatsDto } from '@/schemas/adminHealth'
import {
  ADMIN_HEALTH_BLUE,
  ADMIN_HEALTH_FONT,
  ADMIN_HEALTH_CARD_SHADOW,
} from './adminHealthStyles'

function formatNumber(value: number): string {
  return value.toLocaleString('en-US')
}

interface StatCardProps {
  label: string
  value: number
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div
      className="rounded-2xl border border-[#E8EEF5] bg-white p-4 text-center sm:p-5"
      style={{ boxShadow: ADMIN_HEALTH_CARD_SHADOW }}
    >
      <p
        className="text-base font-bold text-[#0F172A]"
        style={{ fontFamily: ADMIN_HEALTH_FONT }}
      >
        {label}
      </p>
      <p
        className="mt-3 text-2xl font-bold leading-none sm:text-[28px] lg:text-[32px]"
        style={{ color: ADMIN_HEALTH_BLUE, fontFamily: ADMIN_HEALTH_FONT }}
      >
        {formatNumber(value)}
      </p>
    </div>
  )
}

interface AdminHealthStatsProps {
  stats: AdminHealthStatsDto
}

export default function AdminHealthStats({ stats }: AdminHealthStatsProps) {
  return (
    <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
      <StatCard label="إجمالي المنشآت" value={stats.totalFacilities} />
      <StatCard label="نشطة الآن" value={stats.activeNow} />
      <StatCard label="تحت الصيانة" value={stats.underMaintenance} />
    </section>
  )
}
