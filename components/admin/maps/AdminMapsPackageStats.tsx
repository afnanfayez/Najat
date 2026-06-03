'use client'

import type { ReactNode } from 'react'
import type { AdminMapsPackageSizes } from '@/schemas/adminMaps'
import {
  ADMIN_MAPS_BLUE,
  ADMIN_MAPS_CARD_SHADOW,
  ADMIN_MAPS_FONT,
} from './adminMapsStyles'

interface AdminMapsPackageStatsProps {
  sizes: AdminMapsPackageSizes
}

function MegabyteValue({ value }: { value: number }) {
  return (
    <span className="inline-flex items-baseline gap-2" dir="ltr">
      <span>{value}</span>
      <span>MB</span>
    </span>
  )
}

function SizeCard({
  label,
  value,
  footer,
}: {
  label: string
  value: ReactNode
  footer?: string
}) {
  return (
    <div
      className="flex flex-1 flex-col justify-center rounded-2xl border border-[#E8EEF5] bg-white px-4 py-4 sm:px-5 sm:py-5"
      style={{ boxShadow: ADMIN_MAPS_CARD_SHADOW }}
      dir="rtl"
    >
      <p
        className="text-right text-sm font-bold text-[#0F172A] sm:text-base"
        style={{ fontFamily: ADMIN_MAPS_FONT }}
      >
        {label}
      </p>
      <p
        className="mt-2 text-right text-2xl font-bold leading-none sm:text-[28px] lg:text-[32px]"
        style={{ color: ADMIN_MAPS_BLUE, fontFamily: ADMIN_MAPS_FONT }}
      >
        {value}
      </p>
      {footer && (
        <p
          className="mt-3 text-right text-xs font-medium text-[#94A3B8] sm:text-sm"
          style={{ fontFamily: ADMIN_MAPS_FONT }}
        >
          {footer}
        </p>
      )}
    </div>
  )
}

export default function AdminMapsPackageStats({ sizes }: AdminMapsPackageStatsProps) {
  return (
    <div className="flex h-full flex-col gap-3 sm:gap-4">
      <SizeCard
        label="حجم الخريطة الأساسية"
        value={<MegabyteValue value={sizes.baseMapSizeMb} />}
      />
      <SizeCard
        label="البيانات التفاضلية"
        value={<MegabyteValue value={sizes.differentialDataMb} />}
        footer={sizes.changeRateNote}
      />
    </div>
  )
}
