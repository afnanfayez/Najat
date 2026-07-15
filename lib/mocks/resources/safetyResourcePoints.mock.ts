import { createCrudResource } from '@/lib/mocks/crud/createCrudResource'
import { seedResourcePoints } from '@/lib/mocks/seeds/safetyResourcePoints.seed'
import type { ResourcePointDto } from '@/schemas/safetyApi'

export const resourcePointsResource = createCrudResource<ResourcePointDto & { deletedAt?: string | null }>({
  storageKey: 'resourcePoints',
  seedVersion: 1,
  seed: seedResourcePoints,
  softDelete: true,
})
