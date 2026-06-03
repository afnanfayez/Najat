import type { AdminHealthFacility, CreateAdminHealthFacilityBody } from '@/schemas/adminHealth'
import {
  INITIAL_FACILITY_SETUP,
  type FacilitySetupForm,
  type OperatingStatus,
} from '@/components/admin/health/setup/types'
import { DEFAULT_FACILITY_MAP_CENTER } from '@/components/admin/health/setup/setupConstants'

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
    workingDays: form.selectedDates,
    workingTimes: form.selectedTimes,
    operatingStatus: form.operatingStatus,
    latitude: form.latitude ?? undefined,
    longitude: form.longitude ?? undefined,
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
  const base: FacilitySetupForm = {
    ...INITIAL_FACILITY_SETUP,
    name: facility.name,
    region: REVERSE_REGION_MAP[facility.region] ?? facility.region,
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
    latitude: DEFAULT_FACILITY_MAP_CENTER[0],
    longitude: DEFAULT_FACILITY_MAP_CENTER[1],
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
