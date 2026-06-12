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
