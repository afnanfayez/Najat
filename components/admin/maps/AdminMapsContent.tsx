'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import AdminShell from '../AdminShell'
import AdminMapsPageHeader from './AdminMapsPageHeader'
import AdminMapsPackageStats from './AdminMapsPackageStats'
import AdminMapsIntegrityCard from './AdminMapsIntegrityCard'
import AdminMapsPublishingTable from './AdminMapsPublishingTable'
import AdminMapsInsightCards from './AdminMapsInsightCards'
import { buildDashboardFromSafetyData } from './data/adminMapsService'
import { useSafetyMapData } from '@/hooks/useSafetyMapData'
import { ADMIN_MAPS_FONT } from './adminMapsStyles'

export default function AdminMapsContent() {
  const router = useRouter()
  const mapDataQuery = useSafetyMapData()

  const dashboard = useMemo(() => {
    if (!mapDataQuery.data) return null
    return buildDashboardFromSafetyData(mapDataQuery.data)
  }, [mapDataQuery.data])

  const dangerZones = mapDataQuery.data?.dangerZones ?? []
  const isLoading = mapDataQuery.isLoading

  return (
    <AdminShell activeNav="maps">
      <AdminMapsPageHeader
        onCreatePackage={() => router.push('/admin/maps/new')}
      />

      {isLoading ? (
        <div
          className="flex min-h-[40vh] items-center justify-center"
          style={{ fontFamily: ADMIN_MAPS_FONT }}
        >
          <p className="text-sm font-medium text-[#64748B]">جاري التحميل...</p>
        </div>
      ) : dashboard ? (
        <>
          <section
            dir="rtl"
            className="mb-4 grid grid-cols-1 items-stretch gap-3 sm:mb-6 sm:gap-4 lg:grid-cols-3"
          >
            <div className="lg:col-span-2">
              <AdminMapsIntegrityCard integrity={dashboard.integrity} />
            </div>
            <div className="lg:col-span-1">
              <AdminMapsPackageStats sizes={dashboard.sizes} />
            </div>
          </section>

          <AdminMapsPublishingTable logs={dashboard.publishLogs} />

          <AdminMapsInsightCards insights={dashboard.insights} />

          {/* Danger Zones list — derived from the same offline-first map-data query
              used above, so it stays available offline instead of issuing a
              separate (non-cached) request. */}
          <section dir="rtl" className="mt-6">
            <h2
              className="mb-3 text-base font-bold text-[#1e293b]"
              style={{ fontFamily: ADMIN_MAPS_FONT }}
            >
              مناطق الخطر ({dangerZones.length})
            </h2>
            {dangerZones.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <table className="w-full table-fixed border-collapse text-right" style={{ fontFamily: ADMIN_MAPS_FONT }}>
                  <thead>
                    <tr style={{ background: '#EF44441A' }}>
                      <th className="px-4 py-3 text-right text-[13px] font-semibold text-[#7E7D7D] w-[40%]">الوصف</th>
                      <th className="px-4 py-3 text-center text-[13px] font-semibold text-[#7E7D7D] w-[25%]">مستوى الخطر</th>
                      <th className="px-4 py-3 text-center text-[13px] font-semibold text-[#7E7D7D] w-[20%]">الحالة</th>
                      <th className="px-4 py-3 text-center text-[13px] font-semibold text-[#7E7D7D] w-[15%]">المعرّف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dangerZones.map((zone) => {
                      const levelColor = zone.dangerLevel === 'high' ? '#F44336' : zone.dangerLevel === 'medium' ? '#F59E0B' : '#22C55E'
                      const levelLabel = zone.dangerLevel === 'high' ? 'عالٍ' : zone.dangerLevel === 'medium' ? 'متوسط' : 'منخفض'
                      return (
                        <tr key={zone.id} className="border-b border-[#EEF2F7] last:border-b-0">
                          <td className="px-4 py-3 text-right text-[14px] font-medium text-[#1e293b]">
                            {zone.description || '—'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className="rounded-full px-3 py-1 text-[12px] font-bold"
                              style={{ background: `${levelColor}1A`, color: levelColor }}
                            >
                              {levelLabel}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className="rounded-full px-3 py-1 text-[12px] font-bold"
                              style={{
                                background: zone.isActive ? '#22C55E1A' : '#94A3B81A',
                                color: zone.isActive ? '#22C55E' : '#94A3B8',
                              }}
                            >
                              {zone.isActive ? 'نشطة' : 'غير نشطة'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-[12px] font-mono text-[#64748B]">
                            {zone.id.slice(0, 8)}…
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-[#94A3B8]" style={{ fontFamily: ADMIN_MAPS_FONT }}>لا توجد مناطق خطر مسجلة</p>
            )}
          </section>
        </>
      ) : (
        <div
          className="flex min-h-[30vh] items-center justify-center"
          style={{ fontFamily: ADMIN_MAPS_FONT }}
        >
          <p className="text-sm font-medium text-[#94A3B8]">لا توجد بيانات متاحة</p>
        </div>
      )}
    </AdminShell>
  )
}
