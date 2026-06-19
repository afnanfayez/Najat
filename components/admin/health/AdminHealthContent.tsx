'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import AdminShell from '../AdminShell'
import AdminHealthPageHeader from './AdminHealthPageHeader'
import AdminHealthStats from './AdminHealthStats'
import AdminHealthToolbar from './AdminHealthToolbar'
import AdminHealthFacilityGrid from './AdminHealthFacilityGrid'
import AdminHealthLatestContent from './AdminHealthLatestContent'
import AdminHealthActionButton from './AdminHealthActionButton'
import AdminMedicalContentCategoryTabs from './AdminMedicalContentCategoryTabs'
import AdminMedicalContentGrid from './AdminMedicalContentGrid'
import DeleteFacilityDialog from './DeleteFacilityDialog'
import {
  deleteAdminHealthFacility,
  deleteAdminHealthContent,
  updateAdminHealthFacilityStatus,
  toContentQueryParams,
  toFacilitiesQueryParams,
} from './data/adminHealthService'
import { useAdminHealthFacilities } from '@/hooks/useAdminHealthFacilities'
import {
  useAdminHealthLatestContent,
  useAdminHealthMedicalContent,
} from '@/hooks/useAdminHealthMedicalContent'
import type {
  AdminHealthContentCategory,
  AdminHealthFacility,
  AdminHealthFacilityTypeFilter,
  AdminHealthMedicalContent,
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
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<AdminHealthViewTab>('facilities')
  const [contentCategory, setContentCategory] =
    useState<AdminHealthContentCategory>('first-aid')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [region, setRegion] = useState<AdminHealthRegionFilter>('all')
  const [status, setStatus] = useState<AdminHealthStatusFilter>('all')
  const [facilityType, setFacilityType] = useState<AdminHealthFacilityTypeFilter>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)
  const [facilityToDelete, setFacilityToDelete] =
    useState<AdminHealthFacility | null>(null)

  useEffect(() => {
    if (searchParams.get('tab') === 'content') {
      setActiveTab('content')
    }
  }, [searchParams])

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
        facilityType,
      }),
    [debouncedSearch, region, status, facilityType],
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

  const filteredMedicalContent = useMemo(
    () => allMedicalContent.filter((item) => item.category === contentCategory),
    [allMedicalContent, contentCategory],
  )

  function handleAddFacility() {
    router.push('/admin/health/new')
  }

  function handleAddContent() {
    router.push(`/admin/health/content/new?category=${contentCategory}`)
  }

  function handleManageAllContent() {
    setActiveTab('content')
    setContentCategory('first-aid')
    router.replace('/admin/health?tab=content')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCall(phone?: string) {
    if (phone) window.open(`tel:${phone}`, '_self')
  }

  function handleEditFacility(facility: AdminHealthFacility) {
    const type = facility.facilityType ?? 'hospital'
    router.push(`/admin/health/${facility.id}/edit?type=${type}`)
  }

  function handleDeleteFacility(facility: AdminHealthFacility) {
    setFacilityToDelete(facility)
  }

  async function handleFacilityStatusChange(
    facility: AdminHealthFacility,
    newStatus: AdminHealthFacility['status'],
  ) {
    setUpdatingStatusId(facility.id)
    try {
      await updateAdminHealthFacilityStatus(facility.id, newStatus!, facility.facilityType)
      await queryClient.invalidateQueries({ queryKey: ['admin-health-facilities'] })
      await queryClient.invalidateQueries({ queryKey: ['health-facilities'] })
      toast.success(`تم تغيير حالة ${facility.name} إلى "${newStatus === 'open' ? 'مفتوح' : 'مغلق'}"`)
    } catch {
      toast.error(`تعذّر تغيير حالة ${facility.name}`)
    } finally {
      setUpdatingStatusId(null)
    }
  }

  function handleOpenContent(item: AdminHealthMedicalContent) {
    router.push(`/admin/health/content/${item.id}`)
  }

  function handleEditContent(item: AdminHealthMedicalContent) {
    router.push(`/admin/health/content/${item.id}`)
  }

  async function handleDeleteContent(item: AdminHealthMedicalContent) {
    const confirmed = window.confirm(`هل أنت متأكد من حذف «${item.title}»؟`)
    if (!confirmed) return

    setDeletingId(item.id)
    try {
      await deleteAdminHealthContent(item.id)
      await queryClient.invalidateQueries({ queryKey: ['admin-health-content'] })
      await queryClient.invalidateQueries({ queryKey: ['health-guide', 'articles'] })
      toast.success('تم حذف المحتوى بنجاح', { position: 'top-center' })
    } catch {
      toast.error('تعذّر حذف المحتوى', { position: 'top-center' })
    } finally {
      setDeletingId(null)
    }
  }

  async function confirmDeleteFacility() {
    if (!facilityToDelete) return

    setDeletingId(facilityToDelete.id)
    try {
      await deleteAdminHealthFacility(facilityToDelete.id, facilityToDelete.facilityType)
      await queryClient.invalidateQueries({ queryKey: ['admin-health-facilities'] })
      await queryClient.invalidateQueries({ queryKey: ['health-facilities'] })
      setFacilityToDelete(null)
      toast.success('تم حذف المنشأة بنجاح', { position: 'top-center' })
    } catch {
      toast.error('تعذّر حذف المنشأة', { position: 'top-center' })
    } finally {
      setDeletingId(null)
    }
  }

  const isContentView = activeTab === 'content'

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

      <AdminHealthPageHeader
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab)
          router.replace(tab === 'content' ? '/admin/health?tab=content' : '/admin/health')
        }}
        title={isContentView ? 'الدليل الصحي' : 'الخدمات الصحية'}
        subtitle={
          isContentView
            ? 'نقدم لك إرشادات موثوقة للإسعافات الأولية والتوعية الصحية والدعم النفسي لضمان سلامتك وسلامة عائلتك في جميع الظروف.'
            : 'ابحث عن أقرب مراكز الرعاية الصحية وتأكد من توفر الأدوية في الوقت الفعلي'
        }
      />

      {!isContentView && <AdminHealthStats stats={stats ?? DEFAULT_STATS} />}

      {!isContentView ? (
        <>
          <AdminHealthToolbar
            mode="facilities"
            search={search}
            region={region}
            status={status}
            facilityType={facilityType}
            actionLabel="إضافة منشأة جديدة"
            onSearchChange={setSearch}
            onRegionChange={setRegion}
            onStatusChange={setStatus}
            onFacilityTypeChange={setFacilityType}
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
              updatingStatusId={updatingStatusId}
              onDetails={handleEditFacility}
              onEdit={handleEditFacility}
              onDelete={handleDeleteFacility}
              onCall={(f) => handleCall(f.phone)}
              onStatusChange={handleFacilityStatusChange}
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
              onItemClick={handleOpenContent}
            />
          )}
        </>
      ) : (
        <div dir="rtl" className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            <AdminMedicalContentCategoryTabs
              active={contentCategory}
              onChange={setContentCategory}
            />
            <div className="flex w-full justify-stretch sm:justify-end">
              <AdminHealthActionButton
                label="إضافة محتوى جديد"
                onClick={handleAddContent}
              />
            </div>
          </div>

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
            <AdminMedicalContentGrid
              items={filteredMedicalContent}
              onOpen={handleOpenContent}
              onEdit={handleEditContent}
              onDelete={handleDeleteContent}
            />
          )}
        </div>
      )}
    </AdminShell>
  )
}
