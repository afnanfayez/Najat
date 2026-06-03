'use client'

import type { AdminAidDonor } from '@/schemas/adminAid'
import { ADMIN_AID_BLUE, ADMIN_AID_FONT } from './adminAidStyles'

function formatAmount(value: number): string {
  return `$ ${value.toLocaleString('en-US')}`
}

interface AdminAidDonorCardProps {
  donor: AdminAidDonor
  onDetails?: (donor: AdminAidDonor) => void
}

export default function AdminAidDonorCard({ donor, onDetails }: AdminAidDonorCardProps) {
  return (
    <article
      className="flex h-full min-h-[180px] flex-col rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:p-5"
      dir="rtl"
    >
      <div className="text-right">
        <h3
          className="text-base font-bold sm:text-lg"
          style={{ color: ADMIN_AID_BLUE, fontFamily: ADMIN_AID_FONT }}
        >
          {donor.name}
        </h3>
        <p
          className="mt-0.5 text-sm font-medium text-[#64748B]"
          style={{ fontFamily: ADMIN_AID_FONT }}
        >
          {donor.subtitle}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
        <div className="flex flex-wrap items-start gap-5">
          <div className="text-right">
            <p
              className="text-xs font-bold text-[#0F172A]"
              style={{ fontFamily: ADMIN_AID_FONT }}
            >
              إجمالي التبرعات
            </p>
            <p
              className="mt-0.5 text-sm font-bold"
              style={{ color: ADMIN_AID_BLUE, fontFamily: ADMIN_AID_FONT }}
            >
              {formatAmount(donor.totalAmount)}
            </p>
          </div>
          <div className="text-right">
            <p
              className="text-xs font-bold text-[#0F172A]"
              style={{ fontFamily: ADMIN_AID_FONT }}
            >
              آخر تبرع
            </p>
            <p
              className="mt-0.5 text-sm font-bold"
              style={{ color: ADMIN_AID_BLUE, fontFamily: ADMIN_AID_FONT }}
            >
              {donor.lastDonation}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDetails?.(donor)}
          className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
          style={{
            fontFamily: ADMIN_AID_FONT,
            background: ADMIN_AID_BLUE,
          }}
        >
          عرض التفاصيل
        </button>
      </div>
    </article>
  )
}
