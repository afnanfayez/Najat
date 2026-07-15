import { bilingual, nowIso } from '@/lib/mocks/crud/paginationHelpers'
import { safetyZonesResource } from '@/lib/mocks/resources/safetyZones.mock'
import { safeRoadsResource } from '@/lib/mocks/resources/safetyRoads.mock'
import { resourcePointsResource } from '@/lib/mocks/resources/safetyResourcePoints.mock'
import type { DangerZoneDto } from '@/schemas/safetyApi'

function allActive<T extends { deletedAt?: string | null }>(store: { getAll(): T[] }): T[] {
  return store.getAll().filter((item) => !item.deletedAt)
}

export function getMapData() {
  return {
    success: true as const,
    statusCode: 200,
    message: bilingual('تم الجلب بنجاح', 'Fetched successfully'),
    data: {
      dangerZones: allActive(safetyZonesResource.store),
      safeRoads: allActive(safeRoadsResource.store),
      resourcePoints: allActive(resourcePointsResource.store),
    },
    timestamp: nowIso(),
  }
}

function polygonContainsPoint(zone: DangerZoneDto, lat: number, lng: number): boolean {
  const area = zone.area
  if (!area || typeof area !== 'object' || !('coordinates' in area)) return false
  const rings = (area as { coordinates: number[][][] }).coordinates
  const ring = rings?.[0]
  if (!Array.isArray(ring) || ring.length === 0) return false
  const lats = ring.map((c) => c[1])
  const lngs = ring.map((c) => c[0])
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng
}

export function checkSafety(query: URLSearchParams) {
  const lat = Number(query.get('lat') ?? '0')
  const lng = Number(query.get('lng') ?? '0')
  const matches = allActive(safetyZonesResource.store).filter((zone) =>
    polygonContainsPoint(zone, lat, lng),
  )
  return {
    success: true as const,
    statusCode: 200,
    message: bilingual('تم الفحص بنجاح', 'Checked successfully'),
    data: {
      safe: matches.length === 0,
      zones: matches,
    },
    timestamp: nowIso(),
  }
}
