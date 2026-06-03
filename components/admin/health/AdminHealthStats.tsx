'use client'

import type { LucideIcon } from 'lucide-react'
import { Building2, ClipboardList, Settings } from 'lucide-react'
import type { AdminHealthStatsDto } from '@/schemas/adminHealth'
import {
  ADMIN_HEALTH_BLUE,
  ADMIN_HEALTH_FONT,
  ADMIN_HEALTH_CARD_SHADOW,
} from './adminHealthStyles'

interface StatItemProps {
  title: string
  value: string
  icon: LucideIcon
}

function StatItem({ title, value, icon: Icon }: StatItemProps) {
  return (
    <div
      className="rounded-2xl border border-[#E8EEF5] bg-white p-5"
      style={{ boxShadow: ADMIN_HEALTH_CARD_SHADOW }}
    >
      <div className="flex w-full items-center justify-start gap-3 text-right">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E3F2FD]">
          <Icon size={22} style={{ color: ADMIN_HEALTH_BLUE }} strokeWidth={2} />
        </div>
        <p
          className="text-sm font-medium text-[#334155]"
          style={{ fontFamily: ADMIN_HEALTH_FONT }}
        >
          {title}
        </p>
      </div>
      <p
        className="mt-3 w-full text-[28px] font-bold leading-none sm:text-[32px]"
        style={{ color: ADMIN_HEALTH_BLUE, fontFamily: ADMIN_HEALTH_FONT }}
      >
        {value}
      </p>
    </div>
  )
}

function formatNumber(value: number): string {
  return value.toLocaleString('en-US')
}

interface AdminHealthStatsProps {
  stats: AdminHealthStatsDto
}

export default function AdminHealthStats({ stats }: AdminHealthStatsProps) {
  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatItem
        title="إجمالي المنشآت"
        value={formatNumber(stats.totalFacilities)}
        icon={Building2}
      />
      <StatItem
        title="نشطة الآن"
        value={formatNumber(stats.activeNow)}
        icon={ClipboardList}
      />
      <StatItem
        title="تحت الصيانة"
        value={formatNumber(stats.underMaintenance)}
        icon={Settings}
      />
    </section>
  )
}
