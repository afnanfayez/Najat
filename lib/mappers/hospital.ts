import type { HealthFacility } from '@/schemas/healthFacility'
import type {
  HealthDoctor,
  HealthMedicineRow,
  HealthServiceChip,
  WorkingHoursBlock,
} from '@/schemas/healthFacilityDetail'
import type {
  HospitalCapacityStatus,
  HospitalDto,
  NearbyHospitalDto,
} from '@/schemas/hospitalApi'
import { pickLocalImage } from '@/lib/utils/localImage'
import {
  medicationAvailabilityPercent,
  medicationRowsFromUnknown,
} from '@/lib/mappers/medicationAvailability'

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

export function deriveRegion(lat: number): 'north' | 'south' {
  return lat >= 31.42 ? 'north' : 'south'
}

export const DOCTOR_PHOTO = '/assets/doctor.png'

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
  closed: {
    short: 'مغلق',
    detail: 'المنشأة مغلقة حالياً',
  },
}

const CATEGORY_AR: Record<string, string> = {
  emergency: 'الطوارئ',
  surgery: 'الجراحة',
  icu: 'العناية المركزة',
  pediatrics: 'طب الأطفال',
  general: 'الطب العام',
  cardiology: 'القلب والأوعية',
  orthopedics: 'العظام',
  obstetrics: 'النساء والولادة',
  neurology: 'الأعصاب',
  oncology: 'الأورام',
}

function stableHash(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * نسبة ثابتة لكل مستشفى ضمن نطاق يلائم حالة الاستيعاب من الـ API (مثل المخطط في
 * [Najat API](https://graduation-project-api-production-8251.up.railway.app/api/docs)).
 * تُمزج مع نسبة `currentMedications` عند توفرها.
 */
export function hospitalMedicineAvailabilityPercent(
  status: HospitalCapacityStatus,
  facilityId: string,
  medPercentFromApi?: number,
): number {
  const band: Record<HospitalCapacityStatus, { lo: number; hi: number }> = {
    available: { lo: 71, hi: 93 },
    full: { lo: 46, hi: 64 },
    critical: { lo: 21, hi: 41 },
    closed: { lo: 3, hi: 13 },
  }
  const clamp: Record<HospitalCapacityStatus, { min: number; max: number }> = {
    available: { min: 58, max: 100 },
    full: { min: 36, max: 72 },
    critical: { min: 12, max: 48 },
    closed: { min: 0, max: 20 },
  }

  const { lo, hi } = band[status]
  const span = hi - lo + 1
  const statusBase = lo + (stableHash(`${facilityId}\0${status}`) % span)

  if (medPercentFromApi == null) {
    return statusBase
  }

  const blended = Math.round(statusBase * 0.58 + medPercentFromApi * 0.42)
  const { min, max } = clamp[status]
  return Math.min(max, Math.max(min, blended))
}

function buildWorkingHours(
  hours?: string | null,
  days?: string[],
): WorkingHoursBlock | undefined {
  if (!hours && !days?.length) return undefined
  if (hours === '24/7') {
    return {
      bannerText: 'المستشفى يعمل على مدار الساعة',
      rows: [{ label: 'يومياً', time: '24 ساعة' }],
    }
  }
  return {
    rows: [{ label: days?.join('، ') ?? '', time: hours ?? '' }],
  }
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

  const doctors: HealthDoctor[] = (dto.workingDoctors ?? []).map((d) => ({
    name: d.name,
    specialty: d.specialty,
    photo: DOCTOR_PHOTO,
    time: d.workingHours || '',
    days: d.workingDays || [],
  }))

  const medicines: HealthMedicineRow[] = (dto.currentMedications ?? [])
    .filter((m): m is Record<string, unknown> => typeof m === 'object' && m !== null)
    .map((m) => {
      const name = typeof m.name === 'string' ? m.name : ''
      const type = typeof m.type === 'string' ? m.type : ''
      const status = typeof m.status === 'string' ? m.status : ''
      return {
        name,
        category: type,
        status:
          status === 'available'
            ? 'متوفر'
            : status === 'low_stock'
              ? 'كمية محدودة'
              : 'غير متوفر',
        statusColor:
          status === 'available'
            ? '#4CAF50'
            : status === 'low_stock'
              ? '#FF9800'
              : '#F44336',
      }
    })

  const hospitalServices: HealthServiceChip[] = (
    dto.healthcareCategories ?? []
  ).map((c) => ({
    label: CATEGORY_AR[c.toLowerCase()] ?? c,
  }))

  const medRows = medicationRowsFromUnknown(dto.currentMedications)

  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
    category: 'hospitals',
    isOpen,
    medicineAvailability: hospitalMedicineAvailabilityPercent(
      dto.status,
      dto.id,
      medicationAvailabilityPercent(medRows),
    ),
    phone: dto.contactNumber ?? undefined,
    imageUrl: pickLocalImage('hospitals', dto.id),
    latitude: dto.latitude,
    longitude: dto.longitude,
    capacityStatus: dto.status,
    distanceMeters: opts.distanceMeters,
    distance: distanceLabel,
    updatedAt: dto.updatedAt,
    fromHospitalApi: true,
    detail: {
      mapPreviewImageUrl: pickLocalImage('hospitals', dto.id),
      lastUpdatedAt: dto.updatedAt
        ? formatUpdatedRelative(dto.updatedAt)
        : undefined,
      facilityKindLabel: 'مستشفى',
      doctors: doctors.length > 0 ? doctors : undefined,
      medicines: medicines.length > 0 ? medicines : undefined,
      medicinesAll: medicines.length > 0 ? medicines : undefined,
      hospitalServices: hospitalServices.length > 0 ? hospitalServices : undefined,
      workingHours: buildWorkingHours(dto.workingHours, dto.workingDays),
    },
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
