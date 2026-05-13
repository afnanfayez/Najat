import type { HealthFacility } from '@/schemas/healthFacility'
import type { PharmacyDto } from '@/schemas/pharmacyApi'
import { pickLocalImage } from '@/lib/utils/localImage'
import { formatUpdatedRelative, deriveRegion } from '@/lib/mappers/hospital'

function deriveMedicineAvailability(
  meds?: Array<{ status: string }>,
): number {
  if (!meds || meds.length === 0) return 50
  const available = meds.filter(
    (m) => !m.status.toLowerCase().includes('out') && m.status !== 'unavailable',
  ).length
  return Math.round((available / meds.length) * 100)
}

export function mapPharmacyDtoToFacility(dto: PharmacyDto): HealthFacility {
  const types = dto.currentMedications
    ? [...new Set(dto.currentMedications.map((m) => m.type).filter(Boolean))]
    : []

  const hours = dto.is24Hours
    ? { rows: [{ label: 'يومياً', time: '24 ساعة' }] }
    : undefined

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
    category: 'pharmacies',
    // API has no real-time isOpen field; 24h pharmacies are always open, others assumed open
    isOpen: dto.is24Hours ?? true,
    phone: dto.contactNumber ?? undefined,
    imageUrl: pickLocalImage('pharmacies', dto.id),
    latitude: dto.latitude,
    longitude: dto.longitude,
    region: deriveRegion(dto.latitude),
    medicineAvailability: deriveMedicineAvailability(dto.currentMedications),
    updatedAt: dto.updatedAt,
    detail: {
      mapPreviewImageUrl: pickLocalImage('pharmacies', dto.id),
      lastUpdatedAt: dto.updatedAt
        ? formatUpdatedRelative(dto.updatedAt)
        : undefined,
      facilityKindLabel: 'صيدلية',
      pharmacyMedicineTypes: types.length > 0 ? types : undefined,
      pharmacySupplies: [],
      pharmacyHours: hours,
      medicines: medicines.length > 0 ? medicines : undefined,
    },
  }
}
