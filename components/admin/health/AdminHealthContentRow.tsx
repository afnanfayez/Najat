'use client'

import Image from 'next/image'
import { ChevronLeft, User } from 'lucide-react'
import type { AdminHealthMedicalContent } from '@/schemas/adminHealth'
import {
  ADMIN_HEALTH_CONTENT_STATUS_LABELS,
  ADMIN_HEALTH_CONTENT_THUMBNAIL,
} from '@/lib/mocks/adminHealthMockData'
import { ADMIN_HEALTH_FONT } from './adminHealthStyles'

const STATUS_STYLES: Record<
  AdminHealthMedicalContent['status'],
  { bg: string; text: string }
> = {
  published: { bg: '#E8F5E9', text: '#2E7D32' },
  review: { bg: '#E3F2FD', text: '#1565C0' },
  draft: { bg: '#F1F5F9', text: '#64748B' },
}

interface AdminHealthContentRowProps {
  item: AdminHealthMedicalContent
  onClick?: (item: AdminHealthMedicalContent) => void
}

export default function AdminHealthContentRow({
  item,
  onClick,
}: AdminHealthContentRowProps) {
  const badge = STATUS_STYLES[item.status]

  return (
    <button
      type="button"
      onClick={() => onClick?.(item)}
      className="flex w-full items-center gap-4 rounded-2xl border border-[#E8EEF5] bg-white p-4 text-right shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#FAFBFC]"
      dir="rtl"
    >
      {/* الصورة — أقصى اليمين */}
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[#E8EEF5] sm:h-[72px] sm:w-28">
        <Image
          src={item.thumbnailUrl || ADMIN_HEALTH_CONTENT_THUMBNAIL}
          alt={item.title}
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>

      {/* العنوان والبيانات — في الوسط */}
      <div className="min-w-0 flex-1 text-right">
        <p
          className="truncate text-base font-bold text-[#1e293b] sm:text-lg"
          style={{ fontFamily: ADMIN_HEALTH_FONT }}
        >
          {item.title}
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-start gap-3 text-sm text-[#64748B]">
          <span style={{ fontFamily: ADMIN_HEALTH_FONT }}>{item.date}</span>
          <span className="flex items-center gap-1.5">
            <User size={14} />
            <span style={{ fontFamily: ADMIN_HEALTH_FONT }}>{item.author}</span>
          </span>
        </div>
      </div>

      {/* الحالة — يسار النص */}
      <span
        className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold sm:text-sm"
        style={{
          background: badge.bg,
          color: badge.text,
          fontFamily: ADMIN_HEALTH_FONT,
        }}
      >
        {ADMIN_HEALTH_CONTENT_STATUS_LABELS[item.status]}
      </span>

      {/* السهم — أقصى اليسار */}
      <ChevronLeft size={20} className="shrink-0 text-[#94A3B8]" />
    </button>
  )
}
