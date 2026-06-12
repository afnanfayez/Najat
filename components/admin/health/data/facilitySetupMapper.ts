import type {
  AdminHealthFacility,
  AdminHealthFacilityDoctor,
  AdminHealthFacilityMedication,
  CreateAdminHealthFacilityBody,
} from '@/schemas/adminHealth'
import {
  INITIAL_FACILITY_SETUP,
  type DrugStatus,
  type FacilitySetupForm,
  type OperatingStatus,
} from '@/components/admin/health/setup/types'
import { DEFAULT_FACILITY_MAP_CENTER, FACILITY_SERVICES } from '@/components/admin/health/setup/setupConstants'

// Mirrors latToRegion in lib/api/adminHealth.ts — north ≥ 31.40 | central ≥ 31.20 | south < 31.20
export function latToFormRegion(lat: number): string {
  if (lat >= 31.40) return 'north'
  if (lat >= 31.20) return 'central'
  return 'south'
}

// May 2026 starts on Friday → index 0 = الجمعة
const ARABIC_DAY_NAMES = [
  'الجمعة', 'السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس',
]

function datesToWeekdayNames(dates: number[]): string[] {
  const seen = new Set<string>()
  for (const d of dates) seen.add(ARABIC_DAY_NAMES[(d - 1) % 7])
  return Array.from(seen)
}

function timesToWorkingHoursString(times: string[]): string {
  if (times.length === 0) return 'على مدار 24 ساعة'
  const sorted = [...times].sort()
  return `${sorted[0]} - ${sorted[sorted.length - 1]}`
}

const DRUG_STATUS_TO_API: Record<DrugStatus, string> = {
  available: 'available',
  low: 'low_stock',
  unavailable: 'out_of_stock',
}

const SERVICE_LABEL_MAP: Record<string, string> = Object.fromEntries(
  FACILITY_SERVICES.map((s) => [s.id, s.label]),
)

const REGION_MAP: Record<string, CreateAdminHealthFacilityBody['region']> = {
  gaza: 'central',
  north: 'north',
  central: 'central',
  south: 'south',
}

const REVERSE_REGION_MAP: Record<string, string> = {
  north: 'north',
  central: 'central',
  south: 'south',
}

function mapOperatingStatus(status: OperatingStatus): {
  status: CreateAdminHealthFacilityBody['status']
  isOpen: boolean
} {
  switch (status) {
    case 'efficient':
      return { status: 'open', isOpen: true }
    case 'limited':
      return { status: 'maintenance', isOpen: true }
    case 'closed':
      return { status: 'closed', isOpen: false }
  }
}

function mapApiStatusToOperating(
  status: CreateAdminHealthFacilityBody['status'],
  isOpen: boolean,
): OperatingStatus {
  if (status === 'maintenance') return 'limited'
  if (status === 'closed' || !isOpen) return 'closed'
  return 'efficient'
}

export function mapFacilityFormToCreateBody(
  form: FacilitySetupForm,
): CreateAdminHealthFacilityBody {
  const { status, isOpen } = mapOperatingStatus(form.operatingStatus)
  const weekdays = datesToWeekdayNames(form.selectedDates)
  const workingHours = timesToWorkingHoursString(form.selectedTimes)

  const workingDoctors: AdminHealthFacilityDoctor[] = form.staff.map(({ name, role, shift }) => ({
    name,
    specialty: role,
    workingDays: weekdays,
    workingHours: shift,
  }))

  const currentMedications: AdminHealthFacilityMedication[] = form.drugs.map(
    ({ name, subtitle, status: drugStatus }) => ({
      name,
      type: subtitle || 'عام',
      status: DRUG_STATUS_TO_API[drugStatus] ?? 'available',
    }),
  )

  return {
    name: form.name.trim(),
    address: form.address.trim(),
    phone: form.phone.trim() || undefined,
    region: REGION_MAP[form.region] ?? 'central',
    status,
    isOpen,
    imageUrl: form.images[0]?.url ?? '/assets/health1.jpg',
    services: form.selectedServices,
    drugs: form.drugs.map(({ name, subtitle, status: drugStatus }) => ({
      name,
      subtitle,
      status: drugStatus,
    })),
    staff: form.staff.map(({ name, role, shift }) => ({ name, role, shift })),
    workingDays: weekdays,
    workingTimes: form.selectedTimes,
    operatingStatus: form.operatingStatus,
    latitude: form.latitude ?? undefined,
    longitude: form.longitude ?? undefined,
    workingDoctors,
    currentMedications,
    workingHours,
    medicalSupplies: form.drugs.map((d) => d.name),
    healthcareCategories: form.selectedServices.map((id) => SERVICE_LABEL_MAP[id] ?? id),
  }
}

export function buildFacilityFormData(form: FacilitySetupForm): FormData {
  const fd = new FormData()
  const body = mapFacilityFormToCreateBody(form)

  Object.entries(body).forEach(([key, value]) => {
    if (value === undefined) return
    if (Array.isArray(value) || typeof value === 'object') {
      fd.append(key, JSON.stringify(value))
    } else {
      fd.append(key, String(value))
    }
  })

  form.images.forEach((img) => {
    if (img.file) fd.append('images', img.file, img.name)
  })

  return fd
}

export function mapFacilityToSetupForm(
  facility: AdminHealthFacility,
  details?: Partial<FacilitySetupForm> | null,
): FacilitySetupForm {
  const lat = facility.latitude ?? DEFAULT_FACILITY_MAP_CENTER[0]
  const lng = facility.longitude ?? DEFAULT_FACILITY_MAP_CENTER[1]

  const base: FacilitySetupForm = {
    ...INITIAL_FACILITY_SETUP,
    name: facility.name,
    region: latToFormRegion(lat),
    address: facility.address,
    phone: facility.phone ?? '',
    operatingStatus: mapApiStatusToOperating(facility.status, facility.isOpen),
    images:
      facility.imageUrl && !facility.imageUrl.startsWith('blob:')
        ? [
            {
              id: 'existing-image',
              url: facility.imageUrl,
              name: 'صورة المنشأة',
            },
          ]
        : [],
    latitude: lat,
    longitude: lng,
  }

  if (!details) return base

  return {
    ...base,
    ...details,
    name: details.name ?? base.name,
    region: details.region ?? base.region,
    address: details.address ?? base.address,
    phone: details.phone ?? base.phone,
    operatingStatus: details.operatingStatus ?? base.operatingStatus,
    images: details.images?.length ? details.images : base.images,
  }
}
