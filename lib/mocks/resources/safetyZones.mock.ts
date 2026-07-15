import { createCrudResource } from '@/lib/mocks/crud/createCrudResource'
import { seedSafetyZones } from '@/lib/mocks/seeds/safetyZones.seed'
import type { DangerZoneDto } from '@/schemas/safetyApi'

export const safetyZonesResource = createCrudResource<DangerZoneDto & { deletedAt?: string | null }>({
  storageKey: 'safetyZones',
  seedVersion: 1,
  seed: seedSafetyZones,
  softDelete: true,
})
