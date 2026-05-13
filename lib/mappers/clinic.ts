import type { HealthFacility } from '@/schemas/healthFacility'
import type { ClinicDto } from '@/schemas/clinicApi'
import type { ClinicServiceItem, HealthDoctor } from '@/schemas/healthFacilityDetail'
import { pickLocalImage } from '@/lib/utils/localImage'
import { metersToKmLabel, formatUpdatedRelative, deriveRegion, DOCTOR_PHOTO } from '@/lib/mappers/hospital'

const CLINIC_ICON =
  'https://api.iconify.design/solar:stethoscope-bold.svg?color=%23F2A122'

export function mapClinicDtoToFacility(dto: ClinicDto): HealthFacility {
  const services: ClinicServiceItem[] = (dto.specialties ?? []).map((s) => ({
    name: s,
    desc: '',
    icon: CLINIC_ICON,
  }))

  const doctors: HealthDoctor[] = (dto.workingDoctors ?? []).map((d) => ({
    name: d.name,
    specialty: d.specialty,
    photo: DOCTOR_PHOTO,
    time: d.workingHours || '',
    days: d.workingDays || [],
  }))

  const medicines = (dto.currentMedications ?? []).map((m) => ({
    name: m.name,
    category: m.type,
    status: m.status === 'available' ? 'متوفر' : 'غير متوفر',
    statusColor: m.status === 'available' ? '#4CAF50' : '#F44336',
  }))

  const distanceMeters = dto.distance
  const distanceLabel =
    distanceMeters != null ? metersToKmLabel(distanceMeters) : undefined

  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
    category: 'clinics',
    isOpen: true,
    phone: dto.contactNumber ?? undefined,
    imageUrl: pickLocalImage('clinics', dto.id),
    latitude: dto.latitude,
    longitude: dto.longitude,
    region: deriveRegion(dto.latitude),
    distanceMeters,
    distance: distanceLabel,
    updatedAt: dto.updatedAt,
    detail: {
      mapPreviewImageUrl: pickLocalImage('clinics', dto.id),
      lastUpdatedAt: dto.updatedAt
        ? formatUpdatedRelative(dto.updatedAt)
        : undefined,
      facilityKindLabel: 'مستوصف',
      doctors: doctors.length > 0 ? doctors : undefined,
      clinicServices: services.length > 0 ? services : undefined,
      clinicMedicines: medicines.length > 0 ? medicines : undefined,
      clinicSupplies: [],
    },
  }
}
