'use client'

import Image from 'next/image'
import { MapPin, Phone, Pencil, Trash2 } from 'lucide-react'
import { availabilityBarColor } from '@/lib/mappers/medicationAvailability'
import type { AdminHealthFacility } from '@/schemas/adminHealth'
import { ADMIN_HEALTH_BLUE, ADMIN_HEALTH_FONT } from './adminHealthStyles'
import { isPendingSyncId } from '@/lib/offline/isPendingSync'
import { PendingSyncBadge } from '@/components/shared/PendingSyncBadge'

interface AdminHealthFacilityCardProps {
  facility: AdminHealthFacility
  isDeleting?: boolean
  isUpdatingStatus?: boolean
  onDetails?: (facility: AdminHealthFacility) => void
  onEdit?: (facility: AdminHealthFacility) => void
  onDelete?: (facility: AdminHealthFacility) => void
  onCall?: (facility: AdminHealthFacility) => void
  onStatusChange?: (facility: AdminHealthFacility, newStatus: AdminHealthFacility['status']) => void
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

const STATUS_CYCLE: Record<NonNullable<AdminHealthFacility['status']>, AdminHealthFacility['status']> = {
  open: 'closed',
  closed: 'open',
  maintenance: 'open',
}

const STATUS_LABEL: Record<NonNullable<AdminHealthFacility['status']>, string> = {
  open: 'مفتوح',
  closed: 'مغلق',
  maintenance: 'صيانة',
}

export default function AdminHealthFacilityCard({
  facility,
  isDeleting = false,
  isUpdatingStatus = false,
  onDetails,
  onEdit,
  onDelete,
  onCall,
  onStatusChange,
}: AdminHealthFacilityCardProps) {
  const barColor = availabilityBarColor(facility.workloadPercent)
  const currentStatus = facility.status ?? (facility.isOpen ? 'open' : 'closed')
  const statusLabel = STATUS_LABEL[currentStatus] ?? (facility.isOpen ? 'مفتوح' : 'مغلق')
  const statusColor = currentStatus === 'open' ? '#4CAF50' : currentStatus === 'maintenance' ? '#F59E0B' : '#9E9E9E'
  const isHospital = !facility.facilityType || facility.facilityType === 'hospital'

  return (
    <article
      className="overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
      dir="rtl"
    >
      <div className="relative aspect-[16/10] w-full">
        <FacilityImage src={facility.imageUrl} alt={facility.name} />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {isHospital && onStatusChange ? (
          <button
            type="button"
            disabled={isUpdatingStatus}
            onClick={() => onStatusChange(facility, STATUS_CYCLE[currentStatus] ?? 'open')}
            title="انقر لتغيير الحالة"
            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ fontFamily: ADMIN_HEALTH_FONT }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: isUpdatingStatus ? '#94A3B8' : statusColor }} />
            <span className="text-xs font-bold" style={{ color: isUpdatingStatus ? '#94A3B8' : statusColor }}>
              {isUpdatingStatus ? '...' : statusLabel}
            </span>
          </button>
        ) : (
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5"
            style={{ fontFamily: ADMIN_HEALTH_FONT }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: statusColor }} />
            <span className="text-xs font-bold" style={{ color: statusColor }}>{statusLabel}</span>
          </div>
        )}

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
          <div className="flex flex-wrap items-center justify-end gap-2">
            <h3
              className="text-lg font-bold text-white sm:text-xl"
              style={{ fontFamily: ADMIN_HEALTH_FONT }}
            >
              {facility.name}
            </h3>
            {isPendingSyncId(facility.id) && <PendingSyncBadge />}
          </div>
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
