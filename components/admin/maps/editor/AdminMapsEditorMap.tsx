'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Search } from 'lucide-react'
import type { AdminMapsEditorLayer } from '@/schemas/adminMaps'
import type { AdminMapsEditorMapInnerProps } from './AdminMapsEditorMapInner'
import { ADMIN_MAPS_FONT } from '../adminMapsStyles'

const AdminMapsEditorMapInner = dynamic<AdminMapsEditorMapInnerProps>(
  () => import('./AdminMapsEditorMapInner'),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-full min-h-[320px] items-center justify-center bg-[#E8F4FD] text-sm font-bold text-[#2196F3]"
        style={{ fontFamily: ADMIN_MAPS_FONT }}
      >
        جاري تحميل الخريطة...
      </div>
    ),
  }
)

interface AdminMapsEditorMapProps {
  layers: AdminMapsEditorLayer[]
  mapLayers: Pick<
    AdminMapsEditorMapInnerProps,
    'safeRoads' | 'dangerZones' | 'resourcePoints'
  >
}

export default function AdminMapsEditorMap({ layers, mapLayers }: AdminMapsEditorMapProps) {
  const [query, setQuery] = useState('')
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null)

  const showCorridors = layers.find((l) => l.id === 'corridors')?.active ?? false
  const showConflict = layers.find((l) => l.id === 'conflict')?.active ?? false
  const showHospitals = layers.find((l) => l.id === 'hospitals')?.active ?? false

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setFlyTo([31.5017, 34.4668])
  }

  return (
    <div className="relative flex h-full min-h-[280px] flex-1 flex-col overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:min-h-[360px]">
      <form
        onSubmit={handleSearchSubmit}
        className="absolute left-1/2 top-3 z-[500] flex w-[calc(100%-1.5rem)] max-w-[420px] -translate-x-1/2 items-center gap-2 rounded-2xl border border-[#E8EEF5] bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(15,23,42,0.12)] sm:top-4 sm:w-[min(92%,420px)] sm:px-4 sm:py-3"
        dir="rtl"
      >
        <Search size={18} className="shrink-0 text-[#94A3B8]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن موقع محدد"
          className="w-full border-none bg-transparent text-right text-sm font-medium text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
          style={{ fontFamily: ADMIN_MAPS_FONT }}
        />
      </form>

      <AdminMapsEditorMapInner
        showCorridors={showCorridors}
        showConflict={showConflict}
        showHospitals={showHospitals}
        flyTo={flyTo}
        {...mapLayers}
      />
    </div>
  )
}
