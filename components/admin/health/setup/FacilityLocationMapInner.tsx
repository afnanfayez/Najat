'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import { DEFAULT_FACILITY_MAP_CENTER } from './setupConstants'
import { SETUP_FONT } from './setupStyles'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl

const facilityMarkerIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export interface FacilityLocationMapInnerProps {
  latitude: number | null
  longitude: number | null
  onLocationChange: (location: { latitude: number; longitude: number }) => void
}

function MapResizeController() {
  const map = useMap()
  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 120)
    return () => window.clearTimeout(timer)
  }, [map])
  return null
}

function MapClickPicker({
  onLocationChange,
}: {
  onLocationChange: (location: { latitude: number; longitude: number }) => void
}) {
  useMapEvents({
    click(event) {
      onLocationChange({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      })
    },
  })
  return null
}

function MapViewSync({
  latitude,
  longitude,
}: {
  latitude: number | null
  longitude: number | null
}) {
  const map = useMap()

  useEffect(() => {
    if (latitude != null && longitude != null) {
      map.flyTo([latitude, longitude], map.getZoom(), { duration: 0.6 })
    }
  }, [latitude, longitude, map])

  return null
}

export default function FacilityLocationMapInner({
  latitude,
  longitude,
  onLocationChange,
}: FacilityLocationMapInnerProps) {
  const hasMarker = latitude != null && longitude != null
  const center: [number, number] = hasMarker
    ? [latitude, longitude]
    : DEFAULT_FACILITY_MAP_CENTER

  return (
    <MapContainer
      center={center}
      zoom={14}
      maxZoom={19}
      style={{ width: '100%', height: '100%', minHeight: 176 }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapResizeController />
      <MapClickPicker onLocationChange={onLocationChange} />
      <MapViewSync latitude={latitude} longitude={longitude} />

      {hasMarker && (
        <Marker
          position={[latitude, longitude]}
          icon={facilityMarkerIcon}
          draggable
          eventHandlers={{
            dragend: (event) => {
              const { lat, lng } = event.target.getLatLng()
              onLocationChange({ latitude: lat, longitude: lng })
            },
          }}
        />
      )}
    </MapContainer>
  )
}

export function formatCoordinates(lat: number, lng: number) {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
}

export function LocationHint({ hasLocation }: { hasLocation: boolean }) {
  return (
    <p
      className="mt-2 text-right text-xs text-[#64748B]"
      style={{ fontFamily: SETUP_FONT }}
    >
      {hasLocation
        ? 'اسحب الدبوس لضبط الموقع بدقة، أو انقر على الخريطة لتغييره'
        : 'انقر على الخريطة لتحديد موقع المنشأة'}
    </p>
  )
}
