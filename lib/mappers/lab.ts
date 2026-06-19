import type { HealthFacility } from '@/schemas/healthFacility'
import type { LabDto } from '@/schemas/labApi'
import type { LabTestItem } from '@/schemas/healthFacilityDetail'
import { pickLocalImage } from '@/lib/utils/localImage'
import { formatUpdatedRelative, deriveRegion } from '@/lib/mappers/hospital'
import { medicationAvailabilityPercent } from '@/lib/mappers/medicationAvailability'

const LAB_ICON =
  'https://api.iconify.design/solar:test-tube-bold.svg?color=%23F2A122'

export function mapLabDtoToFacility(dto: LabDto): HealthFacility {
  const labTests: LabTestItem[] = (dto.availableTests ?? []).map((t) => ({
    name: t.name,
    time: t.resultTime,
    icon: LAB_ICON,
    group: 'الكل',
  }))

  const doctors = (dto.workingDoctors ?? []).map((d) => ({
    name: d.name,
    specialty: d.specialty,
    photo: '/assets/doctor.png',
    time: d.workingHours || '',
    days: d.workingDays || [],
  }))

  const medicines = (dto.currentMedications ?? []).map((m) => ({
    name: m.name,
    category: m.type,
    status: m.status === 'available' ? 'متوفر' : 'غير متوفر',
    statusColor: m.status === 'available' ? '#4CAF50' : '#F44336',
  }))

  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
    category: 'labs',
    isOpen: dto.status !== 'closed',
    medicineAvailability: medicationAvailabilityPercent(dto.currentMedications),
    phone: dto.contactNumber ?? undefined,
    imageUrl: dto.image ?? pickLocalImage('labs', dto.id),
    latitude: dto.latitude,
    longitude: dto.longitude,
    region: deriveRegion(dto.latitude),
    updatedAt: dto.updatedAt,
    detail: {
      mapPreviewImageUrl: dto.image ?? pickLocalImage('labs', dto.id),
      lastUpdatedAt: dto.updatedAt
        ? formatUpdatedRelative(dto.updatedAt)
        : undefined,
      facilityKindLabel: dto.isoCertified ? 'مختبر معتمد دولياً' : 'مختبر طبي',
      labTests: labTests.length > 0 ? labTests : undefined,
      labTestTabLabels: ['الكل'],
      labSupplies: [],
      doctors: doctors.length > 0 ? doctors : undefined,
      medicines: medicines.length > 0 ? medicines : undefined,
    },
  }
}
