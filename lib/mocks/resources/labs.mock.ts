import { createCrudResource } from '@/lib/mocks/crud/createCrudResource'
import { seedLabs } from '@/lib/mocks/seeds/labs.seed'
import type { LabDto } from '@/schemas/labApi'

export const labsResource = createCrudResource<LabDto & { deletedAt?: string | null }>({
  storageKey: 'labs',
  seedVersion: 1,
  seed: seedLabs,
  latLngFields: { lat: 'latitude', lng: 'longitude' },
  softDelete: true,
})
