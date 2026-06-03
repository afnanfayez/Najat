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

  const donorsHeaderActions =
    activeTab === 'donors' ? (
      <div className="flex w-full flex-row items-stretch gap-2 sm:w-auto sm:items-center sm:gap-3">
        <button
          type="button"
          onClick={() => handleTabChange('distribution')}
          className="min-w-0 flex-1 rounded-full px-2 py-2 text-[10px] leading-tight font-bold transition-all sm:flex-none sm:px-5 sm:py-2.5 sm:text-sm"
          style={{
            fontFamily: ADMIN_AID_FONT,
            background: `${ADMIN_AID_BLUE}1A`,
            color: ADMIN_AID_BLUE,
            border: `1px solid ${ADMIN_AID_BLUE}33`,
          }}
        >
          نقاط التوزيع والمخزون
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/aid/donors/new')}
          className="min-w-0 flex-1 rounded-xl px-2 py-2 text-[10px] leading-tight font-bold text-white transition-opacity hover:opacity-90 sm:flex-none sm:px-5 sm:py-2.5 sm:text-sm"
          style={{ background: ADMIN_AID_BLUE, fontFamily: ADMIN_AID_FONT }}
        >
          + إضافة مانح جديد
        </button>
      </div>
    ) : null

  return (
    <AdminShell activeNav="aid">
      <AdminAidPageHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        action={donorsHeaderActions}
        hideTabs={activeTab === 'donors'}
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

          <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
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
          <AdminAidDonorGrid
            donors={donors}
            onDetails={(donor) =>
              router.push(`/admin/aid/donors/${donor.id}/edit`)
            }
          />
          <AdminAidDonationsTable
            donations={donations}
            onChange={setDonations}
          />
        </>
      )}
    </AdminShell>
  )
}
