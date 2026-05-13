import type { HealthFacility } from '@/schemas/healthFacility'
import type { DentalDto } from '@/schemas/dentalApi'
import type { DentalServiceItem, HealthDoctor } from '@/schemas/healthFacilityDetail'
import { pickLocalImage } from '@/lib/utils/localImage'
import { metersToKmLabel, formatUpdatedRelative, deriveRegion, DOCTOR_PHOTO } from '@/lib/mappers/hospital'

const DENTAL_ICON =
  'https://api.iconify.design/healthicons:odontology.svg?color=%23F2A122'
const IMPLANT_ICON =
  'https://api.iconify.design/healthicons:odontology-implant.svg?color=%23F2A122'
const ORTHO_ICON =
  'https://api.iconify.design/healthicons:tooth.svg?color=%23F2A122'

export function mapDentalDtoToFacility(dto: DentalDto): HealthFacility {
  const services: DentalServiceItem[] = []
  if (dto.implantsAvailable) {
    services.push({ name: 'زراعة الأسنان', desc: 'تعويض ضائع', icon: IMPLANT_ICON, group: 'جراحة' })
  }
  if (dto.orthodonticsAvailable) {
    services.push({ name: 'تقويم أسنان', desc: 'تقويم شفاف وتقليدي', icon: ORTHO_ICON, group: 'تقويم' })
  }
  if (services.length === 0) {
    services.push({ name: 'علاج أسنان عام', desc: 'خدمات طب أسنان متكاملة', icon: DENTAL_ICON, group: 'الكل' })
  }

  const doctors: HealthDoctor[] = (dto.workingDoctors ?? []).map((d) => ({
    name: d.name,
    specialty: d.specialty,
    photo: DOCTOR_PHOTO,
    time: d.workingHours || '',
    days: d.workingDays || [],
  }))

  const distanceMeters = dto.distance
  const distanceLabel =
    distanceMeters != null ? metersToKmLabel(distanceMeters) : undefined

  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
    category: 'dental',
    isOpen: true,
    phone: dto.contactNumber ?? undefined,
    imageUrl: pickLocalImage('dental', dto.id),
    latitude: dto.latitude,
    longitude: dto.longitude,
    region: deriveRegion(dto.latitude),
    distanceMeters,
    distance: distanceLabel,
    updatedAt: dto.updatedAt,
    detail: {
      mapPreviewImageUrl: pickLocalImage('dental', dto.id),
      lastUpdatedAt: dto.updatedAt
        ? formatUpdatedRelative(dto.updatedAt)
        : undefined,
      facilityKindLabel: dto.implantsAvailable
        ? 'مركز زراعة أسنان'
        : 'عيادة أسنان',
      doctors: doctors.length > 0 ? doctors : undefined,
      dentalServices: services,
      dentalTabLabels: ['الكل', 'جراحة', 'تقويم'],
      dentalSupplies: [],
    },
  }
}
