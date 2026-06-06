'use client'

import { useCallback, useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import AdminShell from '../AdminShell'
import AdminReportsPageHeader, { AdminReportsPrimaryButton } from './AdminReportsPageHeader'
import AdminReportsTabs from './AdminReportsTabs'
import AdminReportsStatisticalView from './AdminReportsStatisticalView'
import AdminReportsOperationsView from './operations/AdminReportsOperationsView'
import {
  exportAdminReportsPdf,
  fetchAdminReportsDashboard,
} from './data/adminReportsService'
import type { AdminReportsTab } from '@/schemas/adminReports'
import { ADMIN_REPORTS_FONT, ADMIN_REPORTS_PAGE, ADMIN_REPORTS_TAB_META } from './adminReportsStyles'

export default function AdminReportsContent() {
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminReportsTab>('statistical')
  const [dashboard, setDashboard] = useState<Awaited<
    ReturnType<typeof fetchAdminReportsDashboard>
  > | null>(null)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAdminReportsDashboard()
      setDashboard(data)
    } catch {
      toast.error('تعذّر تحميل التقارير')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const tabMeta = ADMIN_REPORTS_TAB_META[activeTab]

  async function handleExportPdf() {
    setExporting(true)
    try {
      await exportAdminReportsPdf()
      toast.success('تم تحميل التقرير بنجاح', { position: 'top-center' })
    } catch {
      toast.error('تعذّر تحميل التقرير')
    } finally {
      setExporting(false)
    }
  }

  const headerAction = (
    <>
      <AdminReportsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="hidden lg:flex"
      />
      <AdminReportsPrimaryButton onClick={handleExportPdf} disabled={exporting}>
        <Download size={16} strokeWidth={2.5} />
        {exporting ? 'جاري التحميل...' : 'تحميل PDF'}
      </AdminReportsPrimaryButton>
    </>
  )

  return (
    <AdminShell activeNav="reports">
      <div className={ADMIN_REPORTS_PAGE}>
        <AdminReportsPageHeader
          title={tabMeta.title}
          subtitle={tabMeta.subtitle}
          mobileTabs={
            <AdminReportsTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              className="mb-4 lg:hidden"
            />
          }
          action={headerAction}
        />

        {loading ? (
          <div
            className="flex min-h-[40vh] items-center justify-center"
            style={{ fontFamily: ADMIN_REPORTS_FONT }}
          >
            <p className="text-sm font-medium text-[#64748B]">جاري التحميل...</p>
          </div>
        ) : dashboard && activeTab === 'statistical' ? (
          <AdminReportsStatisticalView
            dashboard={dashboard.statistical}
            onViewRegionalDetails={() => toast.info('التفاصيل الإقليمية — قريباً')}
          />
        ) : dashboard && activeTab === 'operations' ? (
          <AdminReportsOperationsView
            dashboard={dashboard.operations}
            onOpenMap={() => toast.info('الخريطة الكاملة — قريباً')}
          />
        ) : null}
      </div>
    </AdminShell>
  )
}
