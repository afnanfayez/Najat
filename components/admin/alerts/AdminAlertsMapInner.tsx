'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import type { AdminManagedAlert } from '@/schemas/adminAlert'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl

function createMarkerIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:14px;height:14px;
      background:${color};
      border:2px solid #fff;
      border-radius:50%;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

interface AdminAlertsMapInnerProps {
  alerts: AdminManagedAlert[]
  mapCenter: { lat: number; lng: number }
}

export default function AdminAlertsMapInner({ alerts, mapCenter }: AdminAlertsMapInnerProps) {
  return (
    <MapContainer
      center={[mapCenter.lat, mapCenter.lng]}
      zoom={14}
      style={{ width: '100%', height: '100%', minHeight: 320 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {alerts.map((alert) => (
        <Marker
          key={alert.id}
          position={[alert.lat, alert.lng]}
          icon={createMarkerIcon(alert.accentColor)}
        >
          <Popup>
            <strong>{alert.title}</strong>
            <br />
            {alert.location}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
