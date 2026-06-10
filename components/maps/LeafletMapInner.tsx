'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'

import { MAP_CENTER } from '@/lib/mocks/mapsMockData'
import SafetyMapLayersOverlay from './SafetyMapLayersOverlay'
import type {
  MapDangerZone,
  MapResourcePoint,
  MapSafeRoad,
} from '@/lib/maps/safetyMapTransforms'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

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
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    setIsOffline(!navigator.onLine)
    const onOnline = () => setIsOffline(false)
    const onOffline = () => setIsOffline(true)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={14}
      maxZoom={19}
      style={{ width: '100%', height: '100%', background: isOffline ? '#eef2f5' : undefined }}
      zoomControl={false}
    >
      {!isOffline && (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
          maxNativeZoom={19}
        />
      )}

      {isOffline && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 400,
          opacity: 0.5,
          fontFamily: "'Cairo', sans-serif",
          fontSize: '24px',
          color: '#607D8B',
          pointerEvents: 'none'
        }}>
          وضع عدم الاتصال - شبكة الخريطة غير متوفرة
        </div>
      )}

      <MapResizeController />
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
        <Marker position={flyTo.coords} icon={blueIcon}>
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
