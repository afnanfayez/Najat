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
      className="flex h-full flex-col rounded-2xl border border-[#E8EEF5] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
      dir="rtl"
    >
      <div className="flex-1 text-right">
        <h3
          className="text-base font-bold text-[#1E293B] sm:text-lg"
          style={{ fontFamily: ADMIN_AID_FONT }}
        >
          {donor.name}
        </h3>
        <p
          className="mt-1 text-sm font-medium text-[#64748B]"
          style={{ fontFamily: ADMIN_AID_FONT }}
        >
          {donor.subtitle}
        </p>

        <div className="mt-4 space-y-1">
          <p className="text-sm text-[#64748B]" style={{ fontFamily: ADMIN_AID_FONT }}>
            الإجمالي:{' '}
            <span className="font-bold" style={{ color: ADMIN_AID_BLUE }}>
              {formatAmount(donor.totalAmount)}
            </span>
          </p>
          <p className="text-xs text-[#94A3B8]" style={{ fontFamily: ADMIN_AID_FONT }}>
            آخر تبرع: {donor.lastDonation}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDetails?.(donor)}
        className="mt-4 self-start rounded-xl border-2 px-4 py-2 text-sm font-bold transition-opacity hover:opacity-80"
        style={{
          fontFamily: ADMIN_AID_FONT,
          color: ADMIN_AID_BLUE,
          borderColor: ADMIN_AID_BLUE,
        }}
      >
        عرض التفاصيل
      </button>
    </article>
  )
}
