import type { CreateAdminHealthFacilityBody } from '@/schemas/adminHealth'
import type { FacilitySetupForm, OperatingStatus } from '@/components/admin/health/setup/types'

const REGION_MAP: Record<string, CreateAdminHealthFacilityBody['region']> = {
  gaza: 'central',
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
