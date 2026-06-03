'use client'

import Image from 'next/image'
import { MapPin, Phone, Pencil, Trash2 } from 'lucide-react'
import { availabilityBarColor } from '@/lib/mappers/medicationAvailability'
import type { AdminHealthFacility } from '@/schemas/adminHealth'
import { ADMIN_HEALTH_BLUE, ADMIN_HEALTH_FONT } from './adminHealthStyles'

interface AdminHealthFacilityCardProps {
  facility: AdminHealthFacility
  isDeleting?: boolean
  onDetails?: (facility: AdminHealthFacility) => void
  onEdit?: (facility: AdminHealthFacility) => void
  onDelete?: (facility: AdminHealthFacility) => void
  onCall?: (facility: AdminHealthFacility) => void
}

function FacilityImage({ src, alt }: { src: string; alt: string }) {
  const isRemote = src.startsWith('http://') || src.startsWith('https://')
  if (isRemote) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    )
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 33vw"
      className="object-cover"
    />
  )
}

export default function AdminHealthFacilityCard({
  facility,
  isDeleting = false,
  onDetails,
  onEdit,
  onDelete,
  onCall,
}: AdminHealthFacilityCardProps) {
  const barColor = availabilityBarColor(facility.workloadPercent)
  const statusLabel = facility.isOpen ? 'مفتوح الآن' : 'مغلق'
  const statusColor = facility.isOpen ? '#4CAF50' : '#9E9E9E'

  return (
    <article
      className="overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
      dir="rtl"
    >
      <div className="relative aspect-[16/10] w-full">
        <FacilityImage src={facility.imageUrl} alt={facility.name} />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        <div
          className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5"
          style={{ fontFamily: ADMIN_HEALTH_FONT }}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: statusColor }}
          />
          <span className="text-xs font-bold" style={{ color: statusColor }}>
            {statusLabel}
          </span>
        </div>

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <button
            type="button"
            aria-label="تعديل"
            onClick={() => onEdit?.(facility)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2196F3] text-white shadow-md transition-opacity hover:opacity-90"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            aria-label="حذف"
            disabled={isDeleting}
            onClick={() => onDelete?.(facility)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F44336] text-white shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="absolute bottom-3 right-3 left-3 text-right">
          <h3
            className="text-lg font-bold text-white sm:text-xl"
            style={{ fontFamily: ADMIN_HEALTH_FONT }}
          >
            {facility.name}
          </h3>
          <div className="mt-1 flex items-center justify-start gap-1.5 text-white/90">
            <MapPin size={14} className="shrink-0" />
            <span className="text-xs font-medium sm:text-sm">{facility.address}</span>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <div className="mb-3 sm:mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span
              className="text-xs font-semibold text-[#64748B]"
              style={{ fontFamily: ADMIN_HEALTH_FONT }}
            >
              نسبة عمل المستشفى
            </span>
            <span
              className="text-xs font-bold text-[#1e293b]"
              style={{ fontFamily: ADMIN_HEALTH_FONT }}
            >
              {facility.workloadPercent}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#E8EEF5]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${facility.workloadPercent}%`,
                background: barColor,
                marginRight: 0,
                marginLeft: 'auto',
              }}
            />
          </div>
        </div>

        <div className="flex items-stretch gap-2">
          <button
            type="button"
            onClick={() => onDetails?.(facility)}
            className="min-w-0 flex-1 rounded-lg py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 sm:text-sm"
            style={{ background: ADMIN_HEALTH_BLUE, fontFamily: ADMIN_HEALTH_FONT }}
          >
            التفاصيل
          </button>
          <button
            type="button"
            aria-label="اتصال"
            onClick={() => onCall?.(facility)}
            className="flex w-11 shrink-0 items-center justify-center rounded-lg bg-[#4CAF50] text-white transition-opacity hover:opacity-90 sm:w-12"
          >
            <Phone size={18} />
          </button>
        </div>
      </div>
    </article>
  )
}
