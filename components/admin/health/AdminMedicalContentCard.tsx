'use client'

import Image from 'next/image'
import { Pencil, Trash2 } from 'lucide-react'
import type { AdminHealthMedicalContent } from '@/schemas/adminHealth'
import { ADMIN_HEALTH_BLUE, ADMIN_HEALTH_FONT } from './adminHealthStyles'

interface AdminMedicalContentCardProps {
  item: AdminHealthMedicalContent
  isDeleting?: boolean
  onOpen?: (item: AdminHealthMedicalContent) => void
  onEdit?: (item: AdminHealthMedicalContent) => void
  onDelete?: (item: AdminHealthMedicalContent) => void
}

function ContentImage({ src, alt }: { src: string; alt: string }) {
  const isRemote = src.startsWith('http://') || src.startsWith('https://')
  if (isRemote) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    )
  }
  return (
    <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
  )
}

export default function AdminMedicalContentCard({
  item,
  isDeleting = false,
  onOpen,
  onEdit,
  onDelete,
}: AdminMedicalContentCardProps) {
  return (
    <article
      className="overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
      dir="rtl"
    >
      <div className="relative aspect-[16/10] w-full">
        <ContentImage src={item.thumbnailUrl} alt={item.title} />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            type="button"
            aria-label="تعديل"
            onClick={() => onEdit?.(item)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2196F3] text-white shadow-md transition-opacity hover:opacity-90"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            aria-label="حذف"
            disabled={isDeleting}
            onClick={() => onDelete?.(item)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F44336] text-white shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="absolute right-3 bottom-3 left-3 text-right">
          <p
            className="text-xs font-medium text-white/85 sm:text-sm"
            style={{ fontFamily: ADMIN_HEALTH_FONT }}
          >
            {item.author} — {item.date}
          </p>
          <h3
            className="mt-1 text-lg font-bold text-white sm:text-xl"
            style={{ fontFamily: ADMIN_HEALTH_FONT }}
          >
            {item.title}
          </h3>
          <p
            className="mt-1 line-clamp-2 text-xs leading-6 text-white/80 sm:text-sm"
            style={{ fontFamily: ADMIN_HEALTH_FONT }}
          >
            {item.description}
          </p>
        </div>
      </div>

      <div className="p-4">
        <button
          type="button"
          onClick={() => onOpen?.(item)}
          className="w-full rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: ADMIN_HEALTH_BLUE, fontFamily: ADMIN_HEALTH_FONT }}
        >
          انتقل الآن
        </button>
      </div>
    </article>
  )
}
