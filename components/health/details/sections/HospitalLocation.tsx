'use client'

import React from 'react'
import { ExternalLink, Map, Phone } from 'lucide-react'
import { Card } from '@/components/ui/card'
import {
  DEFAULT_HEALTH_MAP_LAT,
  DEFAULT_HEALTH_MAP_LON,
  googleMapsSearchUrl,
} from '@/lib/health/mapEmbed'
import type { HealthFacility } from '@/schemas/healthFacility'

interface HospitalLocationProps {
  hospital: HealthFacility
}

const TILE_ZOOM = 15
const SUBDOMAINS = ['a', 'b', 'c', 'd']

function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = 2 ** zoom
  const x = Math.floor(((lng + 180) / 360) * n)
  const latRad = (lat * Math.PI) / 180
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  )
  return { x, y, n }
}

function tileUrl(x: number, y: number, z: number, n: number): string {
  const wrappedX = ((x % n) + n) % n
  const clampedY = Math.max(0, Math.min(n - 1, y))
  const subdomain = SUBDOMAINS[Math.abs(wrappedX + clampedY + z) % SUBDOMAINS.length]
  return `https://${subdomain}.basemaps.cartocdn.com/rastertiles/voyager/${z}/${wrappedX}/${clampedY}.png`
}

function StaticMapPreview({ lat, lng }: { lat: number; lng: number }) {
  const center = latLngToTile(lat, lng, TILE_ZOOM)
  const tiles = []

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      tiles.push({
        key: `${dx}:${dy}`,
        src: tileUrl(center.x + dx, center.y + dy, TILE_ZOOM, center.n),
      })
    }
  }

  return (
    <div className="grid h-full w-full grid-cols-3 grid-rows-3">
      {tiles.map((tile) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={tile.key}
          src={tile.src}
          alt=""
          className="h-full w-full select-none object-cover"
          draggable={false}
        />
      ))}
    </div>
  )
}

export default function HospitalLocation({ hospital }: HospitalLocationProps) {
  const phone = hospital.phone ?? '0595188009'
  const lat = hospital.latitude ?? DEFAULT_HEALTH_MAP_LAT
  const lng = hospital.longitude ?? DEFAULT_HEALTH_MAP_LON
  const mapsHref =
    hospital.latitude != null && hospital.longitude != null
      ? googleMapsSearchUrl(lat, lng)
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${hospital.name} ${hospital.address}`,
        )}`

  return (
    <Card className="hdv-location-card p-4 sm:p-5 rounded-[28px] border-2 border-slate-100 shadow-md bg-white flex flex-col">
      <div className="flex items-center gap-3 mb-2 flex-shrink-0">
        <Map size={22} className="text-[#2196F3]" />
        <h3 className="text-lg font-black text-slate-800">الموقع والاتصال</h3>
      </div>
      <div className="location-map-preview relative w-full h-24 sm:h-28 rounded-2xl overflow-hidden mb-3 shadow-inner border border-slate-100 flex-shrink-0 bg-[#e8f4fd]">
        <div className="absolute inset-0">
          <StaticMapPreview lat={lat} lng={lng} />
        </div>
        <div className="absolute left-1/2 top-1/2 z-[2] h-7 w-7 -translate-x-1/2 -translate-y-full rounded-full border-[3px] border-white bg-[#2196F3] shadow-lg">
          <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm bg-[#2196F3]" />
        </div>
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-2 top-2 z-[500] inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur transition-colors hover:text-[#2196F3]"
          aria-label="فتح الموقع على الخرائط"
        >
          <ExternalLink size={16} />
        </a>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-2 text-right">
        <div className="flex items-start gap-3 text-slate-700">
          <img src="https://api.iconify.design/solar:map-point-bold.svg?color=%23F2A122" alt="Location" className="w-5 h-5 flex-shrink-0" />
          <span className="min-w-0 flex-1 break-words font-black text-sm leading-6">{hospital.address}</span>
        </div>
        <div className="flex items-start gap-3 text-slate-700">
          <Phone size={20} className="text-[#F2A122] flex-shrink-0" />
          <span dir="ltr" className="min-w-0 flex-1 break-all text-right font-black text-sm leading-6">{phone}</span>
        </div>
      </div>
    </Card>
  )
}
