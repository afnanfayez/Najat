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
      className="flex w-full min-w-0 flex-col gap-3 overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white p-3 text-right shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#FAFBFC] sm:flex-row sm:items-center sm:gap-4 sm:p-4"
      dir="rtl"
    >
      <div className="flex min-w-0 w-full items-center gap-3 sm:contents">
        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-[#E8EEF5] sm:h-[72px] sm:w-28">
          <Image
            src={item.thumbnailUrl || ADMIN_HEALTH_CONTENT_THUMBNAIL}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 80px, 112px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1 text-right">
          <p
            className="line-clamp-2 text-sm font-bold text-[#1e293b] sm:truncate sm:text-lg"
            style={{ fontFamily: ADMIN_HEALTH_FONT }}
          >
            {item.title}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center justify-start gap-2 text-xs text-[#64748B] sm:mt-2 sm:gap-3 sm:text-sm">
            <span style={{ fontFamily: ADMIN_HEALTH_FONT }}>{item.date}</span>
            <span className="flex items-center gap-1.5">
              <User size={14} className="shrink-0" />
              <span
                className="truncate"
                style={{ fontFamily: ADMIN_HEALTH_FONT }}
              >
                {item.author}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:shrink-0 sm:justify-start">
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-bold sm:px-3 sm:py-1.5 sm:text-sm"
          style={{
            background: badge.bg,
            color: badge.text,
            fontFamily: ADMIN_HEALTH_FONT,
          }}
        >
          {ADMIN_HEALTH_CONTENT_STATUS_LABELS[item.status]}
        </span>

        <ChevronLeft size={20} className="shrink-0 text-[#94A3B8]" />
      </div>
    </button>
  )
}
