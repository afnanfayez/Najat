'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import AdminShell from '../AdminShell'
import AdminDataPageHeader, { AdminDataPrimaryButton } from './AdminDataPageHeader'
import AdminDataStats from './AdminDataStats'
import AdminDataFilterTabs from './AdminDataFilterTabs'
import AdminDataRequestCard from './AdminDataRequestCard'
import {
  approveAdminDataRequest,
  deleteAdminDataRequest,
  fetchAdminDataDashboard,
  filterAdminDataRequests,
} from './data/adminDataService'
import type { AdminDataDashboard, AdminDataFilterTab, AdminDataRequest } from '@/schemas/adminData'
import { ADMIN_DATA_FONT } from './adminDataStyles'

export default function AdminDataContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)
  const [dashboard, setDashboard] = useState<AdminDataDashboard | null>(null)
  const [activeTab, setActiveTab] = useState<AdminDataFilterTab>('all')

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAdminDataDashboard()
      setDashboard(data)
    } catch {
      toast.error('تعذّر تحميل بيانات النظام')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const filtered = useMemo(() => {
    if (!dashboard) return []
    return filterAdminDataRequests(dashboard.requests, activeTab)
  }, [dashboard, activeTab])

  async function handleDelete(request: AdminDataRequest) {
    setActionId(request.id)
    try {
      await deleteAdminDataRequest(request.id)
      toast.success(`تم حذف طلب «${request.title}»`, { position: 'top-center' })
      await loadDashboard()
    } catch {
      toast.error('تعذّر حذف الطلب')
    } finally {
      setActionId(null)
    }
  }

  async function handleApprove(request: AdminDataRequest) {
    setActionId(request.id)
    try {
      await approveAdminDataRequest(request.id)
      toast.success(`تم اعتماد طلب «${request.title}»`, { position: 'top-center' })
      await loadDashboard()
    } catch {
      toast.error('تعذّر اعتماد الطلب')
    } finally {
      setActionId(null)
    }
  }

  return (
    <AdminShell activeNav="data">
      <AdminDataPageHeader
        title="نظرة عامة على البيانات"
        subtitle="إدارة وتدقيق طلبات تحديث المعلومات الميدانية الواردة من المتطوعين في قطاع غزة"
        action={
          <AdminDataPrimaryButton onClick={() => router.push('/admin/data/sync')}>
            النشر ومزامنة البيانات
          </AdminDataPrimaryButton>
        }
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
          <AdminDataStats stats={dashboard.stats} />
          <AdminDataFilterTabs active={activeTab} onChange={setActiveTab} />
          <section className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
            {filtered.map((request) => (
              <AdminDataRequestCard
                key={request.id}
                request={request}
                busy={actionId === request.id}
                onReview={(r) => router.push(`/admin/data/${r.id}/review`)}
                onApprove={handleApprove}
                onDelete={handleDelete}
              />
            ))}
          </section>
          {filtered.length === 0 && (
            <p
              className="py-12 text-center text-sm font-medium text-[#64748B]"
              style={{ fontFamily: ADMIN_DATA_FONT }}
            >
              لا توجد طلبات في هذا التصنيف
            </p>
          )}
        </>
      ) : null}
    </AdminShell>
  )
}
