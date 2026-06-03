'use client'

import type { AdminMapsIntegrity } from '@/schemas/adminMaps'
import { ADMIN_MAPS_FONT } from './adminMapsStyles'
import MapsSyncDonutChart from './MapsSyncDonutChart'

interface MapsPackageIntegrityStripProps {
  integrity: AdminMapsIntegrity
  compact?: boolean
  className?: string
}

export default function MapsPackageIntegrityStrip({
  integrity,
  compact = false,
  className = '',
}: MapsPackageIntegrityStripProps) {
  return (
    <div
      className={`flex flex-col items-center gap-4 rounded-2xl bg-[#E3F2FD]/60 p-4 sm:flex-row sm:items-center sm:gap-5 ${className}`}
      dir="rtl"
    >
      <div className="order-1 shrink-0 sm:order-1">
        <MapsSyncDonutChart integrity={integrity} size={compact ? 'md' : 'lg'} />
      </div>

      <div className="order-2 min-w-0 flex-1 text-right">
        <p
          className="text-xs font-medium text-[#94A3B8] sm:text-sm"
          style={{ fontFamily: ADMIN_MAPS_FONT }}
        >
          سلامة حزمة الخرائط
        </p>
        <p
          className={`mt-1 font-bold text-[#0F172A] ${compact ? 'text-sm' : 'text-sm sm:text-base'}`}
          style={{ fontFamily: ADMIN_MAPS_FONT }}
        >
          الحزمة الإقليمية النشطة: {integrity.activePackage}
        </p>

        <div
          className={`mt-3 grid grid-cols-2 gap-x-4 gap-y-3 ${compact ? '' : 'sm:mt-4 sm:max-w-md sm:gap-x-6'}`}
        >
          <div>
            <p
              className="text-xs font-medium text-[#94A3B8] sm:text-sm"
              style={{ fontFamily: ADMIN_MAPS_FONT }}
            >
              آخر مزامنة ناجحة
            </p>
            <p
              className="mt-1 text-sm font-bold text-[#0F172A] sm:text-base"
              style={{ fontFamily: ADMIN_MAPS_FONT }}
            >
              {integrity.lastSyncAgo}
            </p>
          </div>
          <div>
            <p
              className="text-xs font-medium text-[#94A3B8] sm:text-sm"
              style={{ fontFamily: ADMIN_MAPS_FONT }}
            >
              نقاط التفتيش
            </p>
            <p
              className="mt-1 text-sm font-bold text-[#0F172A] sm:text-base"
              style={{ fontFamily: ADMIN_MAPS_FONT }}
            >
              {integrity.inspectionPoints.toLocaleString('en-US')} نقطة
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
