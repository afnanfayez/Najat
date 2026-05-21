'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet'

import {
  MAP_CENTER,
  MAP_DANGER_ORANGE,
  MAP_DANGER_RED,
  MAP_RESOURCE_MARKERS,
  MAP_SAFE_ROUTE,
} from '@/lib/mocks/mapsMockData'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const CENTER: [number, number] = [31.40, 34.47]

const SAFE_ROUTE: [number, number][] = [
  [31.410, 34.465],
  [31.415, 34.470],
  [31.420, 34.465],
  [31.418, 34.458],
]

const DANGER_RED: [number, number][] = [
  [31.408, 34.455],
  [31.412, 34.462],
  [31.416, 34.456],
]

const DANGER_ORANGE: [number, number][] = [
  [31.415, 34.458],
  [31.418, 34.463],
  [31.422, 34.458],
  [31.424, 34.465],
]

const RESOURCE_MARKERS = [
  { lat: 31.418, lng: 34.462, name: 'باركس عبد العالل' },
  { lat: 31.406, lng: 34.468, name: 'مركز شباب الأمل' },
]

const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
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

export default function LeafletMapInner({
  showSafeRoutes,
  showDangerZones,
  showResourceActivity,
  flyTo,
}: LeafletMapInnerProps) {
  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={14}
      maxZoom={19}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
        maxNativeZoom={19}
      />

      <FlyController flyTo={flyTo} />

      {flyTo && (
        <Marker position={flyTo.coords} icon={blueIcon}>
          <Popup>
            <span style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 14 }}>
              {flyTo.label}
            </span>
          </Popup>
        </Marker>
      )}

      {showSafeRoutes && (
        <Polyline
          positions={MAP_SAFE_ROUTE}
          pathOptions={{ color: '#4CAF50', weight: 5, opacity: 0.9 }}
        />
      )}

      {showDangerZones && (
        <>
          <Polyline
            positions={MAP_DANGER_RED}
            pathOptions={{ color: '#F44336', weight: 5, opacity: 0.9 }}
          />
          <Polyline
            positions={MAP_DANGER_ORANGE}
            pathOptions={{ color: '#FF9800', weight: 4, opacity: 0.85, dashArray: '8 4' }}
          />
        </>
      )}

      {showResourceActivity &&
        MAP_RESOURCE_MARKERS.map((m) => (
          <Marker key={m.name} position={[m.lat, m.lng]} icon={orangeIcon}>
            <Popup>
              <span style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 14 }}>
                {m.name}
              </span>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  )
}
