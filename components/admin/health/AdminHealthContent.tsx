'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import AdminShell from '../AdminShell'
import AdminHealthPageHeader from './AdminHealthPageHeader'
import AdminHealthStats from './AdminHealthStats'
import AdminHealthToolbar from './AdminHealthToolbar'
import AdminHealthFacilityGrid from './AdminHealthFacilityGrid'
import AdminHealthLatestContent from './AdminHealthLatestContent'
import AdminHealthMedicalContentPanel from './AdminHealthMedicalContentPanel'
import DeleteFacilityDialog from './DeleteFacilityDialog'
import {
  deleteAdminHealthFacility,
  toContentQueryParams,
  toFacilitiesQueryParams,
} from './data/adminHealthService'
import { useAdminHealthFacilities } from '@/hooks/useAdminHealthFacilities'
import {
  useAdminHealthLatestContent,
  useAdminHealthMedicalContent,
} from '@/hooks/useAdminHealthMedicalContent'
import type {
  AdminHealthFacility,
  AdminHealthRegionFilter,
  AdminHealthStatusFilter,
  AdminHealthViewTab,
} from '@/schemas/adminHealth'
import { ADMIN_HEALTH_FONT } from './adminHealthStyles'

const DEFAULT_STATS = {
  totalFacilities: 0,
  activeNow: 0,
  underMaintenance: 0,
}

export default function AdminHealthContent() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<AdminHealthViewTab>('facilities')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [region, setRegion] = useState<AdminHealthRegionFilter>('all')
  const [status, setStatus] = useState<AdminHealthStatusFilter>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [facilityToDelete, setFacilityToDelete] =
    useState<AdminHealthFacility | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  const facilitiesQueryParams = useMemo(
    () =>
      toFacilitiesQueryParams({
        search: debouncedSearch,
        region,
        status,
      }),
    [debouncedSearch, region, status],
  )

  const contentQueryParams = useMemo(
    () => toContentQueryParams(debouncedSearch),
    [debouncedSearch],
  )

  const {
    facilities,
    stats,
    isLoading: facilitiesLoading,
    isError: facilitiesError,
  } = useAdminHealthFacilities(facilitiesQueryParams)

  const {
    items: latestContent,
    isLoading: latestLoading,
    isError: latestError,
  } = useAdminHealthLatestContent(3)

  const {
    items: allMedicalContent,
    isLoading: contentLoading,
    isError: contentError,
  } = useAdminHealthMedicalContent(contentQueryParams)

  function handleAddFacility() {
    router.push('/admin/health/new')
  }

  function handleAddContent() {
    toast.info('سيتم ربط إضافة المقال بالـ API قريباً')
  }

  function handleManageAllContent() {
    setActiveTab('content')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCall(phone?: string) {
    if (phone) window.open(`tel:${phone}`, '_self')
  }

  function handleEditFacility(facility: AdminHealthFacility) {
    router.push(`/admin/health/${facility.id}/edit`)
  }

  function handleDeleteFacility(facility: AdminHealthFacility) {
    setFacilityToDelete(facility)
  }

  async function confirmDeleteFacility() {
    if (!facilityToDelete) return

    setDeletingId(facilityToDelete.id)
    try {
      await deleteAdminHealthFacility(facilityToDelete.id)
      await queryClient.invalidateQueries({ queryKey: ['admin-health-facilities'] })
      setFacilityToDelete(null)
      toast.success('تم حذف المنشأة بنجاح', { position: 'top-center' })
    } catch {
      toast.error('تعذّر حذف المنشأة', { position: 'top-center' })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminShell activeNav="health">
      <DeleteFacilityDialog
        facility={facilityToDelete}
        open={Boolean(facilityToDelete)}
        loading={deletingId === facilityToDelete?.id}
        onClose={() => {
          if (deletingId) return
          setFacilityToDelete(null)
        }}
        onConfirm={confirmDeleteFacility}
      />

      <AdminHealthPageHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <AdminHealthStats stats={stats ?? DEFAULT_STATS} />

      {activeTab === 'facilities' ? (
        <>
          <AdminHealthToolbar
            mode="facilities"
            search={search}
            region={region}
            status={status}
            actionLabel="إضافة منشأة جديدة"
            onSearchChange={setSearch}
            onRegionChange={setRegion}
            onStatusChange={setStatus}
            onAction={handleAddFacility}
          />

          {facilitiesLoading && (
            <p
              className="py-10 text-center text-sm text-[#64748B]"
              style={{ fontFamily: ADMIN_HEALTH_FONT }}
            >
              جاري تحميل المنشآت...
            </p>
          )}

          {facilitiesError && (
            <p
              className="py-10 text-center text-sm text-[#F44336]"
              style={{ fontFamily: ADMIN_HEALTH_FONT }}
            >
              تعذّر تحميل المنشآت. حاول مرة أخرى.
            </p>
          )}

          {!facilitiesLoading && !facilitiesError && (
            <AdminHealthFacilityGrid
              facilities={facilities}
              deletingId={deletingId}
              onDetails={() => toast.info('عرض التفاصيل قريباً')}
              onEdit={handleEditFacility}
              onDelete={handleDeleteFacility}
              onCall={(f) => handleCall(f.phone)}
            />
          )}

          {latestLoading && (
            <p
              className="py-6 text-center text-sm text-[#64748B]"
              style={{ fontFamily: ADMIN_HEALTH_FONT }}
            >
              جاري تحميل المحتوى...
            </p>
          )}

          {latestError && (
            <p
              className="py-6 text-center text-sm text-[#F44336]"
              style={{ fontFamily: ADMIN_HEALTH_FONT }}
            >
              تعذّر تحميل أحدث المحتوى.
            </p>
          )}

          {!latestLoading && !latestError && (
            <AdminHealthLatestContent
              items={latestContent}
              onManageAll={handleManageAllContent}
              onItemClick={() => toast.info('عرض المقال قريباً')}
            />
          )}
        </>
      ) : (
        <>
          <AdminHealthToolbar
            mode="content"
            search={search}
            region={region}
            status={status}
            actionLabel="إضافة مقال جديد"
            onSearchChange={setSearch}
            onRegionChange={setRegion}
            onStatusChange={setStatus}
            onAction={handleAddContent}
          />

          {contentLoading && (
            <p
              className="py-10 text-center text-sm text-[#64748B]"
              style={{ fontFamily: ADMIN_HEALTH_FONT }}
            >
              جاري تحميل المحتوى...
            </p>
          )}

          {contentError && (
            <p
              className="py-10 text-center text-sm text-[#F44336]"
              style={{ fontFamily: ADMIN_HEALTH_FONT }}
            >
              تعذّر تحميل المحتوى. حاول مرة أخرى.
            </p>
          )}

          {!contentLoading && !contentError && (
            <AdminHealthMedicalContentPanel
              items={allMedicalContent}
              onItemClick={() => toast.info('عرض المقال قريباً')}
            />
          )}
        </>
      )}
    </AdminShell>
  )
}
