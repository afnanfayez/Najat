'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import AdminShell from '../AdminShell'
import AdminAuditPageHeader, { AdminAuditPrimaryButton } from './AdminAuditPageHeader'
import AdminAuditStats from './AdminAuditStats'
import AdminAuditFiltersBar from './AdminAuditFiltersBar'
import AdminAuditReportsTable from './AdminAuditReportsTable'
import AdminAuditReportDetailPanel from './AdminAuditReportDetailPanel'
import {
  exportAdminAuditReport,
  fetchAdminAuditDashboard,
  filterAdminAuditReports,
  rejectAdminAuditReport,
  updateAdminAuditReport,
} from './data/adminAuditService'
import type {
  AdminAuditClassificationFilter,
  AdminAuditFilterTab,
  AdminAuditPriorityFilter,
  AdminAuditReport,
  UpdateAdminAuditReportBody,
} from '@/schemas/adminAudit'
import { ADMIN_AUDIT_FONT } from './adminAuditStyles'

export default function AdminAuditContent() {
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)
  const [dashboard, setDashboard] = useState<Awaited<
    ReturnType<typeof fetchAdminAuditDashboard>
  > | null>(null)
  const [activeTab, setActiveTab] = useState<AdminAuditFilterTab>('all')
  const [priority, setPriority] = useState<AdminAuditPriorityFilter>('all')
  const [classification, setClassification] =
    useState<AdminAuditClassificationFilter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAdminAuditDashboard()
      setDashboard(data)
      setSelectedId((prev) => {
        if (prev && data.reports.some((r) => r.id === prev)) return prev
        return data.reports[0]?.id ?? null
      })
    } catch {
      toast.error('تعذّر تحميل بيانات المراجعة والتدقيق')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const filtered = useMemo(() => {
    if (!dashboard) return []
    return filterAdminAuditReports(
      dashboard.reports,
      activeTab,
      priority,
      classification
    )
  }, [dashboard, activeTab, priority, classification])

  const selectedReport = useMemo(
    () => filtered.find((r) => r.id === selectedId) ?? filtered[0] ?? null,
    [filtered, selectedId]
  )

  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedId(null)
      return
    }
    if (!filtered.some((r) => r.id === selectedId)) {
      setSelectedId(filtered[0].id)
    }
  }, [filtered, selectedId])

  async function handleExport() {
    try {
      await exportAdminAuditReport()
      toast.success('تم تصدير التقرير', { position: 'top-center' })
    } catch {
      toast.error('تعذّر تصدير التقرير')
    }
  }

  async function handleSave(report: AdminAuditReport, body: UpdateAdminAuditReportBody) {
    setActionId(report.id)
    try {
      const updated = await updateAdminAuditReport(report.id, body)
      setDashboard(updated)
      toast.success('تم حفظ التعديلات', { position: 'top-center' })
    } catch {
      toast.error('تعذّر حفظ التعديلات')
      throw new Error('save failed')
    } finally {
      setActionId(null)
    }
  }

  async function handleReject(report: AdminAuditReport) {
    setActionId(report.id)
    try {
      const updated = await rejectAdminAuditReport(report.id)
      setDashboard(updated)
      toast.success(`تم رفض بلاغ «${report.issueType}»`, { position: 'top-center' })
    } catch {
      toast.error('تعذّر رفض البلاغ')
    } finally {
      setActionId(null)
    }
  }

  return (
    <AdminShell activeNav="audit">
      <AdminAuditPageHeader
        title="المراجعة والتدقيق"
        subtitle="سجل التغييرات والتدقيق"
        action={
          <AdminAuditPrimaryButton onClick={handleExport}>
            <span className="inline-flex items-center justify-center gap-1.5">
              <Download size={16} />
              تصدير التقرير
            </span>
          </AdminAuditPrimaryButton>
        }
      />

      {loading ? (
        <div
          className="flex min-h-[40vh] items-center justify-center"
          style={{ fontFamily: ADMIN_AUDIT_FONT }}
        >
          <p className="text-sm font-medium text-[#64748B]">جاري التحميل...</p>
        </div>
      ) : dashboard ? (
        <>
          <AdminAuditStats stats={dashboard.stats} />

          <div
            className="grid grid-cols-1 gap-3 sm:gap-4 xl:grid-cols-12 xl:items-stretch"
            dir="rtl"
          >
            <div className="flex min-w-0 flex-col gap-3 xl:col-span-8">
              <AdminAuditFiltersBar
                priority={priority}
                classification={classification}
                onPriorityChange={setPriority}
                onClassificationChange={setClassification}
              />
              <div className="flex min-h-0 flex-1 flex-col">
                <AdminAuditReportsTable
                  reports={filtered}
                  activeTab={activeTab}
                  selectedId={selectedReport?.id ?? null}
                  onTabChange={setActiveTab}
                  onSelect={(r) => setSelectedId(r.id)}
                  className="h-full flex-1"
                />
                {filtered.length === 0 && (
                  <p
                    className="py-10 text-center text-sm font-medium text-[#64748B]"
                    style={{ fontFamily: ADMIN_AUDIT_FONT }}
                  >
                    لا توجد بلاغات في هذا التصنيف
                  </p>
                )}
              </div>
            </div>

            <div className="flex min-w-0 flex-1 xl:col-span-4">
              <AdminAuditReportDetailPanel
                report={selectedReport}
                busy={actionId === selectedReport?.id}
                onSave={handleSave}
                onReject={handleReject}
              />
            </div>
          </div>
        </>
      ) : null}
    </AdminShell>
  )
}
