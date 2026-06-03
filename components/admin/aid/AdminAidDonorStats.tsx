'use client'

import type { AdminAidDonorStats } from '@/schemas/adminAid'
import {
  ADMIN_AID_BLUE,
  ADMIN_AID_CARD_SHADOW,
  ADMIN_AID_FONT,
} from './adminAidStyles'
import AdminAidDonorDonutChart from './AdminAidDonorDonutChart'

interface SplitStatRow {
  label: string
  value: string
}

function SplitStatCard({ rows }: { rows: SplitStatRow[] }) {
  return (
    <div
      className="flex h-full min-h-[200px] flex-col overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white"
      style={{ boxShadow: ADMIN_AID_CARD_SHADOW }}
      dir="rtl"
    >
      {rows.map((row, index) => (
        <div
          key={row.label}
          className={`flex flex-1 flex-col justify-center px-4 py-3 text-right sm:px-6 ${
            index > 0 ? 'border-t border-[#E8EEF5]' : ''
          }`}
        >
          <span
            className="text-sm font-bold text-[#0F172A]"
            style={{ fontFamily: ADMIN_AID_FONT }}
          >
            {row.label}
          </span>
          <span
            className="mt-1 text-xl font-bold sm:text-2xl"
            style={{ color: ADMIN_AID_BLUE, fontFamily: ADMIN_AID_FONT }}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  )
}

interface AdminAidDonorStatsProps {
  stats: AdminAidDonorStats
}

export default function AdminAidDonorStats({ stats }: AdminAidDonorStatsProps) {
  return (
    <section className="mb-6 grid grid-cols-1 items-stretch gap-3 sm:gap-4 lg:grid-cols-3">
      <SplitStatCard
        rows={[
          { label: 'إجمالي التبرعات', value: stats.totalDonationsLabel },
          { label: 'آخر مساهمة', value: stats.lastContribution },
        ]}
      />

      <SplitStatCard
        rows={[
          { label: 'عدد الشركاء الحاليين', value: `${stats.partnersCount} شريك` },
          {
            label: 'اتفاقيات قيد التجديد',
            value: String(stats.renewalsCount),
          },
        ]}
      />

      <AdminAidDonorDonutChart distribution={stats.distribution} />
    </section>
  )
}
