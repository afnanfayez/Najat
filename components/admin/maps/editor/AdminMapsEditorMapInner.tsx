'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import { MAP_CENTER } from '@/lib/mocks/mapsMockData'
import SafetyMapLayersOverlay from '@/components/maps/SafetyMapLayersOverlay'
import type {
  MapDangerZone,
  MapResourcePoint,
  MapSafeRoad,
} from '@/lib/maps/safetyMapTransforms'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl

export interface AdminMapsEditorMapInnerProps {
  showCorridors: boolean
  showConflict: boolean
  showHospitals: boolean
  safeRoads: MapSafeRoad[]
  dangerZones: MapDangerZone[]
  resourcePoints: MapResourcePoint[]
  flyTo: [number, number] | null
}

function isMapMounted(map: ReturnType<typeof useMap>) {
  return map.getContainer()?.isConnected === true
}

function ignoreDetachedLeafletError(err: unknown) {
  return (
    err instanceof TypeError &&
    String(err.message).includes('_leaflet_pos')
  )
}

function MapResizeController() {
  const map = useMap()
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!isMapMounted(map)) return
      try {
        map.invalidateSize()
      } catch (err) {
        if (!ignoreDetachedLeafletError(err)) throw err
      }
    }, 120)
    return () => window.clearTimeout(timer)
  }, [map])
  return null
}

function FlyController({ flyTo }: { flyTo: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (!flyTo || !isMapMounted(map)) return
    try {
      map.stop()
      map.flyTo(flyTo, 15, { duration: 1.2 })
    } catch (err) {
      if (!ignoreDetachedLeafletError(err)) throw err
    }
  }, [flyTo, map])
  return null
}

export default function AdminMapsEditorMapInner({
  showCorridors,
  showConflict,
  showHospitals,
  safeRoads,
  dangerZones,
  resourcePoints,
  flyTo,
}: AdminMapsEditorMapInnerProps) {
  const anyLayerActive = showCorridors || showConflict || showHospitals

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={14}
      maxZoom={19}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />

      <ZoomControl position="bottomright" />
      <MapResizeController />
      <FlyController flyTo={flyTo} />

      <SafetyMapLayersOverlay
        showSafeRoutes={showCorridors}
        showDangerZones={showConflict}
        showResourceActivity={showHospitals}
        safeRoads={safeRoads}
        dangerZones={dangerZones}
        resourcePoints={resourcePoints}
        fitToLayers={anyLayerActive && !flyTo}
      />
    </MapContainer>
  )
}
