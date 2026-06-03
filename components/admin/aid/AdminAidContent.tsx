'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import AdminShell from '../AdminShell'
import AdminAidPageHeader from './AdminAidPageHeader'
import AdminAidDistributionStatsPanel from './AdminAidDistributionStats'
import AdminAidAreaCoveragePanel from './AdminAidAreaCoverage'
import AdminAidResponseChart from './AdminAidResponseChart'
import AdminAidDistributionGrid from './AdminAidDistributionGrid'
import AdminAidDonorStatsPanel from './AdminAidDonorStats'
import AdminAidDonorGrid from './AdminAidDonorGrid'
import AdminAidDonationsTable from './AdminAidDonationsTable'
import {
  fetchAdminAidAreaCoverage,
  fetchAdminAidDistributionPoints,
  fetchAdminAidDistributionStats,
  fetchAdminAidDonations,
  fetchAdminAidDonors,
  fetchAdminAidDonorStats,
  fetchAdminAidResponseData,
} from './data/adminAidService'
import type { AdminAidViewTab } from '@/schemas/adminAid'
import type {
  AdminAidAreaCoverage,
  AdminAidDistributionPoint,
  AdminAidDistributionStats,
  AdminAidDonationRecord,
  AdminAidDonor,
  AdminAidDonorStats,
  AdminAidResponsePoint,
} from '@/schemas/adminAid'
import { ADMIN_AID_BLUE, ADMIN_AID_FONT } from './adminAidStyles'

export default function AdminAidContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<AdminAidViewTab>('distribution')
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState<AdminAidDistributionStats | null>(null)
  const [areas, setAreas] = useState<AdminAidAreaCoverage[]>([])
  const [responseData, setResponseData] = useState<AdminAidResponsePoint[]>([])
  const [points, setPoints] = useState<AdminAidDistributionPoint[]>([])
  const [donorStats, setDonorStats] = useState<AdminAidDonorStats | null>(null)
  const [donors, setDonors] = useState<AdminAidDonor[]>([])
  const [donations, setDonations] = useState<AdminAidDonationRecord[]>([])

  useEffect(() => {
    if (searchParams.get('tab') === 'donors') {
      setActiveTab('donors')
    }
  }, [searchParams])

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      setLoading(true)
      try {
        const [
          statsData,
          areasData,
          response,
          pointsData,
          donorStatsData,
          donorsData,
          donationsData,
        ] = await Promise.all([
          fetchAdminAidDistributionStats(),
          fetchAdminAidAreaCoverage(),
          fetchAdminAidResponseData(),
          fetchAdminAidDistributionPoints(),
          fetchAdminAidDonorStats(),
          fetchAdminAidDonors(),
          fetchAdminAidDonations(),
        ])

        if (!cancelled) {
          setStats(statsData)
          setAreas(areasData)
          setResponseData(response)
          setPoints(pointsData)
          setDonorStats(donorStatsData)
          setDonors(donorsData)
          setDonations(donationsData)
        }
      } catch {
        if (!cancelled) toast.error('تعذّر تحميل بيانات المساعدات')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadData()
    return () => {
      cancelled = true
    }
  }, [])

  function handleTabChange(tab: AdminAidViewTab) {
    setActiveTab(tab)
    const url = tab === 'donors' ? '/admin/aid?tab=donors' : '/admin/aid'
    router.replace(url, { scroll: false })
  }

  const addDonorButton =
    activeTab === 'donors' ? (
      <button
        type="button"
        className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
        style={{ background: ADMIN_AID_BLUE, fontFamily: ADMIN_AID_FONT }}
      >
        + إضافة مانح جديد
      </button>
    ) : null

  return (
    <AdminShell activeNav="aid">
      <AdminAidPageHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        action={addDonorButton}
      />

      {loading ? (
        <div
          className="flex min-h-[40vh] items-center justify-center"
          style={{ fontFamily: ADMIN_AID_FONT }}
        >
          <p className="text-sm font-medium text-[#64748B]">جاري التحميل...</p>
        </div>
      ) : activeTab === 'distribution' ? (
        <>
          {stats && <AdminAidDistributionStatsPanel stats={stats} />}

          <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <AdminAidResponseChart weeklyData={responseData} />
            <AdminAidAreaCoveragePanel areas={areas} />
          </section>

          <AdminAidDistributionGrid
            points={points}
            onAdd={() => router.push('/admin/aid/points/new')}
            onDetails={(point) => router.push(`/admin/aid/points/${point.id}/edit`)}
          />
        </>
      ) : (
        <>
          {donorStats && <AdminAidDonorStatsPanel stats={donorStats} />}
          <AdminAidDonorGrid donors={donors} />
          <AdminAidDonationsTable donations={donations} />
        </>
      )}
    </AdminShell>
  )
}
