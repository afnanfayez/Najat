import type { HealthFacility } from '@/schemas/healthFacility'
import type {
  HospitalCapacityStatus,
  HospitalDto,
  NearbyHospitalDto,
} from '@/schemas/hospitalApi'

export function metersToKmLabel(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} م`
  }
  const km = meters / 1000
  const rounded = km >= 10 ? Math.round(km) : Math.round(km * 10) / 10
  return `${rounded} كم`
}

export function formatUpdatedRelative(iso?: string): string {
  if (!iso) return 'تم التحديث مؤخراً'
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return 'تم التحديث مؤخراً'
  const sec = Math.max(0, Math.floor((Date.now() - t) / 1000))
  if (sec < 60) return 'منذ أقل من دقيقة'
  const m = Math.floor(sec / 60)
  if (m < 60) return `منذ ${m} دقيقة`
  const h = Math.floor(m / 60)
  if (h < 24) return `منذ ${h} ساعة`
  const d = Math.floor(h / 24)
  if (d < 7) return `منذ ${d} يوماً`
  return `منذ ${Math.floor(d / 7)} أسبوع`
}

/** Arabic labels for list / badges */
export const CAPACITY_STATUS_LABEL: Record<
  HospitalCapacityStatus,
  { short: string; detail: string }
> = {
  available: {
    short: 'يستقبل مرضى',
    detail: 'المنشأة تعمل وتستقبل حالات جديدة',
  },
  full: {
    short: 'طاقة استيعابية كاملة',
    detail: 'طاقة الاستيعاب ممتلئة حالياً',
  },
  critical: {
    short: 'وضع حرج',
    detail: 'موارد محدودة — أولوية للحالات الحرجة',
  },
}

function dtoBase(
  dto: HospitalDto,
  opts: { distanceMeters?: number } = {},
): HealthFacility {
  const isOpen = dto.status === 'available'
  const distanceLabel =
    opts.distanceMeters != null
      ? metersToKmLabel(opts.distanceMeters)
      : undefined

  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
    category: 'hospitals',
    isOpen,
    phone: dto.contactNumber ?? undefined,
    imageUrl: dto.image ?? undefined,
    latitude: dto.latitude,
    longitude: dto.longitude,
    capacityStatus: dto.status,
    distanceMeters: opts.distanceMeters,
    distance: distanceLabel,
    updatedAt: dto.updatedAt,
    fromHospitalApi: true,
  }
}

export function mapHospitalDtoToFacility(dto: HospitalDto): HealthFacility {
  return dtoBase(dto)
}

export function mapNearbyHospitalDtoToFacility(
  dto: NearbyHospitalDto,
): HealthFacility {
  return dtoBase(dto, { distanceMeters: dto.distance })
}
