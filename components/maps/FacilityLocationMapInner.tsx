'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import { blueMarkerIcon, CARTO_ATTRIBUTION, CARTO_TILE_URL } from '@/lib/maps/leafletIcons'
import { precacheTilesFromMapView } from '@/lib/pwa/mapTileCache'

export interface FacilityLocationMapInnerProps {
  lat: number
  lng: number
  zoom?: number
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
    }, 100)
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

export default function FacilityLocationMapInner({
  lat,
  lng,
  zoom = 15,
}: FacilityLocationMapInnerProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
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
        keepBuffer={3}
        updateWhenIdle
      />
      <MapResizeController />
      <TilePrefetchController />
      <Marker position={[lat, lng]} icon={blueMarkerIcon} />
    </MapContainer>
  )
}
