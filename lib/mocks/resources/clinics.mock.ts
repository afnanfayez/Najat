import { createCrudResource } from '@/lib/mocks/crud/createCrudResource'
import { seedClinics } from '@/lib/mocks/seeds/clinics.seed'
import type { ClinicDto } from '@/schemas/clinicApi'

export const clinicsResource = createCrudResource<ClinicDto & { deletedAt?: string | null }>({
  storageKey: 'clinics',
  seedVersion: 1,
  seed: seedClinics,
  latLngFields: { lat: 'latitude', lng: 'longitude' },
  softDelete: true,
})
