import { createCrudResource } from '@/lib/mocks/crud/createCrudResource'
import { seedPharmacies } from '@/lib/mocks/seeds/pharmacies.seed'
import type { PharmacyDto } from '@/schemas/pharmacyApi'

export const pharmaciesResource = createCrudResource<PharmacyDto & { deletedAt?: string | null }>({
  storageKey: 'pharmacies',
  seedVersion: 1,
  seed: seedPharmacies,
  latLngFields: { lat: 'latitude', lng: 'longitude' },
  softDelete: true,
})
