'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import AdminShell from '../AdminShell'
import AdminMapsPageHeader from './AdminMapsPageHeader'
import AdminMapsPackageStats from './AdminMapsPackageStats'
import AdminMapsIntegrityCard from './AdminMapsIntegrityCard'
import AdminMapsPublishingTable from './AdminMapsPublishingTable'
import AdminMapsInsightCards from './AdminMapsInsightCards'
import { fetchAdminMapsDashboard } from './data/adminMapsService'
import type { AdminMapsDashboard } from '@/schemas/adminMaps'
import { ADMIN_MAPS_FONT } from './adminMapsStyles'

export default function AdminMapsContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState<AdminMapsDashboard | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const data = await fetchAdminMapsDashboard()
        if (!cancelled) setDashboard(data)
      } catch {
        if (!cancelled) toast.error('تعذّر تحميل بيانات الخرائط')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AdminShell activeNav="maps">
      <AdminMapsPageHeader
        onCreatePackage={() => router.push('/admin/maps/new')}
      />

      {loading ? (
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
      ) : null}
    </AdminShell>
  )
}
