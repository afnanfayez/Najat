'use client'

import type { AdminAidDistributionStats } from '@/schemas/adminAid'
import {
  ADMIN_AID_BLUE,
  ADMIN_AID_CARD_SHADOW,
  ADMIN_AID_FONT,
} from './adminAidStyles'

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
      style={{ boxShadow: ADMIN_AID_CARD_SHADOW }}
    >
      <p
        className="text-base font-bold text-[#0F172A]"
        style={{ fontFamily: ADMIN_AID_FONT }}
      >
        {label}
      </p>
      <p
        className="mt-3 text-2xl font-bold leading-none sm:text-[28px] lg:text-[32px]"
        style={{ color: ADMIN_AID_BLUE, fontFamily: ADMIN_AID_FONT }}
      >
        {formatNumber(value)}
      </p>
    </div>
  )
}

interface AdminAidDistributionStatsProps {
  stats: AdminAidDistributionStats
}

export default function AdminAidDistributionStats({
  stats,
}: AdminAidDistributionStatsProps) {
  return (
    <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      <StatCard label="إجمالي المستفيدين" value={stats.totalBeneficiaries} />
      <StatCard label="الكميات الموزعة" value={stats.distributedQuantities} />
      <StatCard label="المخزون المتاح" value={stats.availableInventory} />
      <StatCard label="متوسط التسليم اليومي" value={stats.avgDailyDelivery} />
    </section>
  )
}
