'use client'

import type { AdminAidDonorStats } from '@/schemas/adminAid'
import {
  ADMIN_AID_BLUE,
  ADMIN_AID_CARD_SHADOW,
  ADMIN_AID_FONT,
} from './adminAidStyles'
import AdminAidDonorDonutChart from './AdminAidDonorDonutChart'

interface AdminAidDonorStatsProps {
  stats: AdminAidDonorStats
}

export default function AdminAidDonorStats({ stats }: AdminAidDonorStatsProps) {
  return (
    <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div
        className="rounded-2xl border border-[#E8EEF5] bg-white p-5"
        style={{ boxShadow: ADMIN_AID_CARD_SHADOW }}
        dir="rtl"
      >
        <p
          className="text-sm font-medium text-[#64748B]"
          style={{ fontFamily: ADMIN_AID_FONT }}
        >
          إجمالي التبرعات
        </p>
        <p
          className="mt-3 text-[28px] font-bold leading-none sm:text-[32px]"
          style={{ color: ADMIN_AID_BLUE, fontFamily: ADMIN_AID_FONT }}
        >
          {stats.totalDonationsLabel}
        </p>
        <p
          className="mt-3 text-xs font-medium text-[#94A3B8]"
          style={{ fontFamily: ADMIN_AID_FONT }}
        >
          آخر مساهمة: {stats.lastContribution}
        </p>
      </div>

      <div
        className="rounded-2xl border border-[#E8EEF5] bg-white p-5"
        style={{ boxShadow: ADMIN_AID_CARD_SHADOW }}
        dir="rtl"
      >
        <p
          className="text-sm font-medium text-[#64748B]"
          style={{ fontFamily: ADMIN_AID_FONT }}
        >
          عدد الشركاء الحاليين
        </p>
        <p
          className="mt-3 text-[28px] font-bold leading-none sm:text-[32px]"
          style={{ color: ADMIN_AID_BLUE, fontFamily: ADMIN_AID_FONT }}
        >
          {stats.partnersCount} شريك
        </p>
        <p
          className="mt-3 text-xs font-medium text-[#94A3B8]"
          style={{ fontFamily: ADMIN_AID_FONT }}
        >
          اتفاقيات قيد التجديد: {stats.renewalsCount}
        </p>
      </div>

      <AdminAidDonorDonutChart distribution={stats.distribution} />
    </section>
  )
}
