import { createCrudResource } from '@/lib/mocks/crud/createCrudResource'
import { seedDentalClinics } from '@/lib/mocks/seeds/dentalClinics.seed'
import type { DentalDto } from '@/schemas/dentalApi'

export const dentalClinicsResource = createCrudResource<DentalDto & { deletedAt?: string | null }>({
  storageKey: 'dentalClinics',
  seedVersion: 1,
  seed: seedDentalClinics,
  latLngFields: { lat: 'latitude', lng: 'longitude' },
  softDelete: true,
})
