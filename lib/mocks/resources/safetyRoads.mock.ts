import { createCrudResource } from '@/lib/mocks/crud/createCrudResource'
import { seedSafeRoads } from '@/lib/mocks/seeds/safetyRoads.seed'
import type { SafeRoadDto } from '@/schemas/safetyApi'

export const safeRoadsResource = createCrudResource<SafeRoadDto & { deletedAt?: string | null }>({
  storageKey: 'safeRoads',
  seedVersion: 1,
  seed: seedSafeRoads,
  softDelete: true,
})
