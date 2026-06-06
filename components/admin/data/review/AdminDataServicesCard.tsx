'use client'

import {
  ADMIN_DATA_BLUE,
  ADMIN_DATA_CARD_SHADOW,
  ADMIN_DATA_FONT,
  ADMIN_DATA_INPUT_BG,
} from '../adminDataStyles'

interface AdminDataServicesCardProps {
  services: string[]
}

export default function AdminDataServicesCard({ services }: AdminDataServicesCardProps) {
  return (
    <article
      className="h-full rounded-2xl border border-[#E8EEF5] bg-white p-4 sm:p-5"
      style={{ boxShadow: ADMIN_DATA_CARD_SHADOW }}
      dir="rtl"
    >
      <h2
        className="mb-4 text-right text-base font-bold text-[#0F172A] sm:text-lg"
        style={{ fontFamily: ADMIN_DATA_FONT }}
      >
        الخدمات المتاحة
      </h2>
      <div className="flex flex-wrap justify-start gap-2">
        {services.map((service) => (
          <span
            key={service}
            className="rounded-full px-3 py-1.5 text-xs font-bold sm:text-sm"
            style={{
              fontFamily: ADMIN_DATA_FONT,
              color: ADMIN_DATA_BLUE,
              background: ADMIN_DATA_INPUT_BG,
            }}
          >
            {service}
          </span>
        ))}
      </div>
    </article>
  )
}
