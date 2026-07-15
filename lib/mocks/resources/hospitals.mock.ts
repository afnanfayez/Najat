import { createCrudResource } from '@/lib/mocks/crud/createCrudResource'
import { seedHospitals } from '@/lib/mocks/seeds/hospitals.seed'
import type { HospitalDto } from '@/schemas/hospitalApi'

export const hospitalsResource = createCrudResource<HospitalDto & { deletedAt?: string | null }>({
  storageKey: 'hospitals',
  seedVersion: 1,
  seed: seedHospitals,
  latLngFields: { lat: 'latitude', lng: 'longitude' },
  softDelete: true,
})
