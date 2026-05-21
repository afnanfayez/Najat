import {
  parseLinePositions,
  parsePointPosition,
  parsePolygonRings,
} from '@/lib/geo/geometryParse'
import type {
  DangerZoneDto,
  MapDataLayers,
  ResourcePointDto,
  SafeRoadDto,
} from '@/schemas/safetyApi'

export type MapSafeRoad = {
  id: string
  name: string
  description: string
  positions: [number, number][]
  isActive: boolean
}

export type MapDangerZone = {
  id: string
  description: string
  dangerLevel: string
  rings: [number, number][][]
  isActive: boolean
}

export type MapResourcePoint = {
  id: string
  name: string
  type: string
  position: [number, number]
  isActive: boolean
}

export type SafetyMapLayers = {
  safeRoads: MapSafeRoad[]
  dangerZones: MapDangerZone[]
  resourcePoints: MapResourcePoint[]
}

function isVisible(item: { isActive?: boolean; deletedAt?: string | null }) {
  return item.isActive !== false && !item.deletedAt
}

export function transformSafeRoad(road: SafeRoadDto): MapSafeRoad | null {
  const positions = parseLinePositions(road.path)
  if (positions.length < 2) return null
  return {
    id: road.id,
    name: road.name,
    description: road.description,
    positions,
    isActive: road.isActive,
  }
}

export function transformDangerZone(zone: DangerZoneDto): MapDangerZone | null {
  const rings = parsePolygonRings(zone.area)
  if (rings.length === 0) return null
  return {
    id: zone.id,
    description: zone.description,
    dangerLevel: zone.dangerLevel,
    rings,
    isActive: zone.isActive,
  }
}

export function transformResourcePoint(point: ResourcePointDto): MapResourcePoint | null {
  const position = parsePointPosition(point.location)
  if (!position) return null
  return {
    id: point.id,
    name: point.name,
    type: point.type,
    position,
    isActive: point.isActive,
  }
}

export function transformMapDataLayers(layers: MapDataLayers): SafetyMapLayers {
  return {
    safeRoads: layers.safeRoads
      .filter(isVisible)
      .map(transformSafeRoad)
      .filter((r): r is MapSafeRoad => r != null),
    dangerZones: layers.dangerZones
      .filter(isVisible)
      .map(transformDangerZone)
      .filter((z): z is MapDangerZone => z != null),
    resourcePoints: layers.resourcePoints
      .filter(isVisible)
      .map(transformResourcePoint)
      .filter((p): p is MapResourcePoint => p != null),
  }
}

export function dangerZoneStyle(level: string): {
  color: string
  fillColor: string
  dashArray?: string
} {
  switch (level) {
    case 'critical':
    case 'high':
      return { color: '#F44336', fillColor: '#F44336' }
    case 'medium':
      return { color: '#FF9800', fillColor: '#FF9800' }
    default:
      return { color: '#FF9800', fillColor: '#FF9800', dashArray: '8 4' }
  }
}

export const RESOURCE_TYPE_LABELS: Record<string, string> = {
  water: 'مياه',
  food: 'غذاء',
  shelter: 'إيواء',
  health: 'صحة',
}
