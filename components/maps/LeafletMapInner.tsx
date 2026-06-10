'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'

import { MAP_CENTER } from '@/lib/mocks/mapsMockData'
import { blueMarkerIcon, CARTO_ATTRIBUTION, CARTO_TILE_URL } from '@/lib/maps/leafletIcons'
import { precacheTilesFromMapView } from '@/lib/pwa/mapTileCache'
import SafetyMapLayersOverlay from './SafetyMapLayersOverlay'
import type {
  MapDangerZone,
  MapResourcePoint,
  MapSafeRoad,
} from '@/lib/maps/safetyMapTransforms'

export interface SearchResult {
  coords: [number, number]
  label: string
}

export interface LeafletMapInnerProps {
  showSafeRoutes: boolean
  showDangerZones: boolean
  showResourceActivity: boolean
  flyTo: SearchResult | null
  safeRoads: MapSafeRoad[]
  dangerZones: MapDangerZone[]
  resourcePoints: MapResourcePoint[]
}

function FlyController({ flyTo }: { flyTo: SearchResult | null }) {
  const map = useMap()
  useEffect(() => {
    if (flyTo) {
      map.flyTo(flyTo.coords, 15, { duration: 1.5 })
    }
  }, [map, flyTo])
  return null
}

function MapResizeController() {
  const map = useMap()
  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 100)
    return () => window.clearTimeout(timer)
  }, [map])
  return null
}

function TilePrefetchController() {
  const map = useMap()

  useMapEvents({
    moveend: () => {
      const center = map.getCenter()
      void precacheTilesFromMapView([center.lat, center.lng], map.getZoom())
    },
    zoomend: () => {
      const center = map.getCenter()
      void precacheTilesFromMapView([center.lat, center.lng], map.getZoom())
    },
  })

  useEffect(() => {
    const center = map.getCenter()
    void precacheTilesFromMapView([center.lat, center.lng], map.getZoom())
  }, [map])

  return null
}

export default function LeafletMapInner({
  showSafeRoutes,
  showDangerZones,
  showResourceActivity,
  flyTo,
  safeRoads,
  dangerZones,
  resourcePoints,
}: LeafletMapInnerProps) {
  const anyLayerActive = showSafeRoutes || showDangerZones || showResourceActivity

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={14}
      maxZoom={19}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution={CARTO_ATTRIBUTION}
        url={CARTO_TILE_URL}
        subdomains="abcd"
        maxZoom={19}
        maxNativeZoom={19}
      />

      <MapResizeController />
      <TilePrefetchController />
      <FlyController flyTo={flyTo} />

      <SafetyMapLayersOverlay
        showSafeRoutes={showSafeRoutes}
        showDangerZones={showDangerZones}
        showResourceActivity={showResourceActivity}
        safeRoads={safeRoads}
        dangerZones={dangerZones}
        resourcePoints={resourcePoints}
        fitToLayers={anyLayerActive && !flyTo}
      />

      {flyTo && (
        <Marker position={flyTo.coords} icon={blueMarkerIcon}>
          <Popup>
            <span style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 14 }}>
              {flyTo.label}
            </span>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}
