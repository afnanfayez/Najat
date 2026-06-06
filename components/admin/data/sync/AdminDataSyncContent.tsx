'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import AdminShell from '../../AdminShell'
import AdminDataBackButton from '../AdminDataBackButton'
import AdminDataPageHeader from '../AdminDataPageHeader'
import AdminDataSyncRequestsTable from './AdminDataSyncRequestsTable'
import AdminDataSyncStatusCard from './AdminDataSyncStatusCard'
import AdminDataActivityLog from './AdminDataActivityLog'
import {
  exportAdminDataSyncCsv,
  fetchAdminDataSyncDashboard,
  publishAdminDataSyncRequest,
  publishAllAdminDataSync,
} from '../data/adminDataService'
import type { AdminDataSyncDashboard, AdminDataSyncRequest } from '@/schemas/adminData'
import { ADMIN_DATA_BLUE, ADMIN_DATA_FONT } from '../adminDataStyles'

export default function AdminDataSyncContent() {
  const [loading, setLoading] = useState(true)
  const [publishingId, setPublishingId] = useState<string | null>(null)
  const [publishingAll, setPublishingAll] = useState(false)
  const [dashboard, setDashboard] = useState<AdminDataSyncDashboard | null>(null)

  const loadSync = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAdminDataSyncDashboard()
      setDashboard(data)
    } catch {
      toast.error('تعذّر تحميل بيانات المزامنة')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSync()
  }, [loadSync])

  async function handlePublish(request: AdminDataSyncRequest) {
    setPublishingId(request.id)
    try {
      await publishAdminDataSyncRequest(request.id)
      toast.success(`تم نشر ${request.code}`, { position: 'top-center' })
      await loadSync()
    } catch {
      toast.error('تعذّر نشر الطلب')
    } finally {
      setPublishingId(null)
    }
  }

  async function handlePublishAll() {
    setPublishingAll(true)
    try {
      await publishAllAdminDataSync()
      toast.success('جاري النشر لكل الأجهزة...', { position: 'top-center' })
      await loadSync()
    } catch {
      toast.error('تعذّر النشر الشامل')
    } finally {
      setPublishingAll(false)
    }
  }

  async function handleExportCsv() {
    try {
      await exportAdminDataSyncCsv()
      toast.success('تم تصدير CSV', { position: 'top-center' })
    } catch {
      toast.error('تعذّر تصدير CSV')
    }
  }

  return (
    <AdminShell activeNav="data">
      <AdminDataBackButton />

      <AdminDataPageHeader
        title="نشر ومزامنة البيانات"
        subtitle="متصل بالخادم العالمي"
      />

      {loading ? (
        <div
          className="flex min-h-[40vh] items-center justify-center"
          style={{ fontFamily: ADMIN_DATA_FONT }}
        >
          <p className="text-sm font-medium text-[#64748B]">جاري التحميل...</p>
        </div>
      ) : dashboard ? (
        <>
          <div
            className="mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:gap-4 xl:grid-cols-[minmax(240px,300px)_minmax(0,1fr)] xl:items-stretch"
            dir="rtl"
          >
            <div className="order-1 flex min-h-0 min-w-0 flex-col xl:order-2">
              <div
                className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
                dir="rtl"
              >
                <div className="min-w-0 flex-1 text-right">
                  <h2
                    className="text-base font-bold text-[#0F172A] sm:text-lg"
                    style={{ fontFamily: ADMIN_DATA_FONT }}
                  >
                    الطلبات المقبولة للمزامنة
                  </h2>
                  <p
                    className="mt-1 text-xs font-medium leading-relaxed text-[#64748B] sm:text-sm"
                    style={{ fontFamily: ADMIN_DATA_FONT }}
                  >
                    تم التحقق من هذه البيانات وهي جاهزة للنشر العالمي
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="w-full shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-5 sm:text-sm"
                  style={{
                    fontFamily: ADMIN_DATA_FONT,
                    background: ADMIN_DATA_BLUE,
                  }}
                >
                  تصدير CSV
                </button>
              </div>
              <AdminDataSyncRequestsTable
                requests={dashboard.acceptedRequests}
                publishingId={publishingId}
                onPublish={handlePublish}
              />
            </div>

            <div className="order-2 xl:order-1">
              <AdminDataSyncStatusCard
                status={dashboard.syncStatus}
                publishingAll={publishingAll}
                onPublishAll={handlePublishAll}
              />
            </div>
          </div>
          <AdminDataActivityLog entries={dashboard.activityLog} />
        </>
      ) : null}
    </AdminShell>
  )
}
