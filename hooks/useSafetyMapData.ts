'use client'

import { useQuery } from '@tanstack/react-query'
import { getToken } from '@/lib/api/auth'
import { safetyAPI } from '@/lib/api/safety'
import { useAuth } from '@/context/AuthContext'
import type { SafetyMapLayers } from '@/lib/maps/safetyMapTransforms'
import { getSafetyMapLayers, putSafetyMapLayers } from '@/lib/offline/db'
import {
  MAP_DANGER_ORANGE,
  MAP_DANGER_RED,
  MAP_RESOURCE_MARKERS,
  MAP_SAFE_ROUTE,
} from '@/lib/mocks/mapsMockData'

function getEmptyLayers(): SafetyMapLayers {
  return {
    safeRoads: [
      {
        id: 'offline-safe-route',
        name: 'مسار آمن محفوظ',
        description: 'مسار إرشادي متاح بدون اتصال',
        positions: MAP_SAFE_ROUTE,
        isActive: true,
      },
    ],
    dangerZones: [
      {
        id: 'offline-danger-red',
        description: 'منطقة خطر محفوظة',
        dangerLevel: 'high',
        rings: [MAP_DANGER_RED],
        isActive: true,
      },
      {
        id: 'offline-danger-orange',
        description: 'منطقة تحذير محفوظة',
        dangerLevel: 'medium',
        rings: [MAP_DANGER_ORANGE],
        isActive: true,
      },
    ],
    resourcePoints: MAP_RESOURCE_MARKERS.map((point, index) => ({
      id: `offline-resource-${index}`,
      name: point.name,
      type: 'aid',
      position: [point.lat, point.lng],
      isActive: true,
    })),
  }
}

function isPointInPolygon(point: [number, number], polygon: [number, number][]) {
  const [x, y] = point
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1]
    const xj = polygon[j][0], yj = polygon[j][1]
    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }
  return inside
}

export function useSafetyMapData() {
  const { isHydrated } = useAuth()

  return useQuery({
    queryKey: ['safety', 'map-data'],
    queryFn: async (): Promise<SafetyMapLayers> => {
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine
      
      if (isOffline) {
        return (await getSafetyMapLayers()) ?? getEmptyLayers()
      }
      
      try {
        const data = await safetyAPI.getMapData()
        if (data) {
          putSafetyMapLayers(data).catch(() => {})
        }
        return data
      } catch (e) {
        console.warn('Network request failed, falling back to offline DB', e)
        return (await getSafetyMapLayers()) ?? getEmptyLayers()
      }
    },
    enabled: isHydrated && Boolean(getToken()),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
}

export function useSafetyCheck(lat: number | null, lng: number | null) {
  const { isHydrated } = useAuth()

  return useQuery({
    queryKey: ['safety', 'check', lat, lng],
    queryFn: async () => {
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine
      
      if (isOffline && lat != null && lng != null) {
        const layers = await getSafetyMapLayers()
        if (layers) {
          const matchingZone = layers.dangerZones.find((zone) => {
            return zone.rings.some((ring) => isPointInPolygon([lat, lng], ring))
          })
          if (matchingZone) {
            return { safe: false, zones: [{ description: matchingZone.description, dangerLevel: matchingZone.dangerLevel }] }
          }
        }
        return { safe: true, zones: [] }
      }

      try {
        return await safetyAPI.check({ lat: lat!, lng: lng! })
      } catch (e) {
        console.warn('Failed to fetch safety check, falling back to local check', e)
        if (lat != null && lng != null) {
          const layers = await getSafetyMapLayers()
          if (layers) {
            const matchingZone = layers.dangerZones.find((zone) => {
              return zone.rings.some((ring) => isPointInPolygon([lat, lng], ring))
            })
            if (matchingZone) {
              return { safe: false, zones: [{ description: matchingZone.description, dangerLevel: matchingZone.dangerLevel }] }
            }
          }
        }
        return { safe: true, zones: [] }
      }
    },
    enabled: isHydrated && Boolean(getToken()) && lat != null && lng != null,
    staleTime: 1000 * 60,
    retry: 1,
  })
}
