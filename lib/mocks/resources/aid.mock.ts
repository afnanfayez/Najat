import { createCrudResource } from '@/lib/mocks/crud/createCrudResource'
import { seedAid } from '@/lib/mocks/seeds/aid.seed'
import type { AidDto } from '@/schemas/aidApi'

export const aidResource = createCrudResource<AidDto & { deletedAt?: string | null }>({
  storageKey: 'aid',
  seedVersion: 1,
  seed: seedAid,
  latLngFields: { lat: 'latitude', lng: 'longitude' },
  softDelete: true,
})
