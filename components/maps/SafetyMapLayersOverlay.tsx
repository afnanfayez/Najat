'use client'

import L from 'leaflet'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import {
  dangerZoneStyle,
  type MapDangerZone,
  type MapResourcePoint,
  type MapSafeRoad,
} from '@/lib/maps/safetyMapTransforms'

const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function popupHtml(title: string, subtitle?: string) {
  return `<div style="font-family:'Cairo',sans-serif;direction:rtl">
    <strong>${title}</strong>
    ${subtitle ? `<p style="margin:6px 0 0;font-size:12px;color:#666">${subtitle}</p>` : ''}
  </div>`
}

export interface SafetyMapLayersOverlayProps {
  showSafeRoutes: boolean
  showDangerZones: boolean
  showResourceActivity: boolean
  safeRoads: MapSafeRoad[]
  dangerZones: MapDangerZone[]
  resourcePoints: MapResourcePoint[]
  fitToLayers: boolean
}

function isMapMounted(map: L.Map) {
  return map.getContainer()?.isConnected === true
}

function ignoreDetachedLeafletError(err: unknown) {
  return (
    err instanceof TypeError &&
    String(err.message).includes('_leaflet_pos')
  )
}

export default function SafetyMapLayersOverlay({
  showSafeRoutes,
  showDangerZones,
  showResourceActivity,
  safeRoads,
  dangerZones,
  resourcePoints,
  fitToLayers,
}: SafetyMapLayersOverlayProps) {
  const map = useMap()

  useEffect(() => {
    if (!isMapMounted(map)) return
    try {
      map.invalidateSize()
    } catch (err) {
      if (!ignoreDetachedLeafletError(err)) throw err
    }
  }, [map])

  useEffect(() => {
    const group = L.layerGroup()
    let frame = 0

    if (showSafeRoutes) {
      safeRoads.forEach((road) => {
        if (road.positions.length < 2) return
        L.polyline(road.positions, {
          color: '#4CAF50',
          weight: 5,
          opacity: 0.9,
        })
          .bindPopup(popupHtml(road.name, road.description))
          .addTo(group)
      })
    }

    if (showDangerZones) {
      dangerZones.forEach((zone) => {
        if (zone.rings.length === 0) return
        const style = dangerZoneStyle(zone.dangerLevel)
        L.polygon(zone.rings, {
          color: style.color,
          fillColor: style.fillColor,
          fillOpacity: 0.25,
          weight: 3,
          opacity: 0.9,
          dashArray: style.dashArray,
        })
          .bindPopup(popupHtml(zone.description, `مستوى الخطر: ${zone.dangerLevel}`))
          .addTo(group)
      })
    }

    if (showResourceActivity) {
      resourcePoints.forEach((point) => {
        L.marker(point.position, { icon: orangeIcon })
          .bindPopup(popupHtml(point.name, point.type))
          .addTo(group)
      })
    }

    group.addTo(map)

    if (fitToLayers) {
      const points: [number, number][] = []
      if (showSafeRoutes) safeRoads.forEach((road) => points.push(...road.positions))
      if (showDangerZones) {
        dangerZones.forEach((zone) => zone.rings.forEach((ring) => points.push(...ring)))
      }
      if (showResourceActivity) {
        resourcePoints.forEach((point) => points.push(point.position))
      }

      if (points.length > 0) {
        frame = window.requestAnimationFrame(() => {
          if (!isMapMounted(map)) return
          try {
            map.invalidateSize()
            map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 15 })
          } catch (err) {
            if (!ignoreDetachedLeafletError(err)) throw err
          }
        })
      }
    }

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      if (isMapMounted(map)) {
        try {
          map.removeLayer(group)
        } catch (err) {
          if (!ignoreDetachedLeafletError(err)) throw err
        }
      }
    }
  }, [
    map,
    showSafeRoutes,
    showDangerZones,
    showResourceActivity,
    safeRoads,
    dangerZones,
    resourcePoints,
    fitToLayers,
  ])

  return null
}
