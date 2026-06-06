'use client'

import {
  ADMIN_DATA_CARD_SHADOW,
  ADMIN_DATA_FONT,
} from '../adminDataStyles'

interface AdminDataSourceNotesCardProps {
  notes: string
}

export default function AdminDataSourceNotesCard({ notes }: AdminDataSourceNotesCardProps) {
  return (
    <article
      className="rounded-2xl border border-[#E8EEF5] bg-white p-4 sm:p-5"
      style={{ boxShadow: ADMIN_DATA_CARD_SHADOW }}
      dir="rtl"
    >
      <h2
        className="mb-3 text-right text-base font-bold text-[#0F172A] sm:text-lg"
        style={{ fontFamily: ADMIN_DATA_FONT }}
      >
        ملاحظات المصادر المعلوماتية
      </h2>
      <p
        className="text-right text-xs leading-7 text-[#64748B] sm:text-sm"
        style={{ fontFamily: ADMIN_DATA_FONT }}
      >
        {notes}
      </p>
    </article>
  )
}
