'use client'

import dynamic from 'next/dynamic'
import type { AdminManagedAlert } from '@/schemas/adminAlert'

const AdminAlertsMapInner = dynamic(() => import('./AdminAlertsMapInner'), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-full min-h-[320px] items-center justify-center bg-[#E8F4FD] text-sm font-bold text-[#2196F3]"
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      جاري تحميل الخريطة...
    </div>
  ),
})

interface AdminAlertsLiveMapProps {
  alerts: AdminManagedAlert[]
  mapCenter: { lat: number; lng: number }
}

export default function AdminAlertsLiveMap({ alerts, mapCenter }: AdminAlertsLiveMapProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2
          className="text-right text-base font-bold text-[#1E293B] sm:text-lg"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          تتبع الموقع المباشر
        </h2>
        <span
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#4CAF50]"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span className="h-2 w-2 rounded-full bg-[#4CAF50]" />
          متصل
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E2E8F0]">
        <AdminAlertsMapInner alerts={alerts} mapCenter={mapCenter} />
      </div>
    </div>
  )
}
