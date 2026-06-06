'use client'

import { useCallback, useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import AdminShell from '../../AdminShell'
import AdminAuditBackButton from '../AdminAuditBackButton'
import AdminAuditPageHeader, { AdminAuditPrimaryButton } from '../AdminAuditPageHeader'
import AdminAuditCompareSection from './AdminAuditCompareSection'
import AdminAuditRecoverySummary from './AdminAuditRecoverySummary'
import AdminAuditVersionLog from './AdminAuditVersionLog'
import {
  exportAdminAuditReport,
  fetchAdminAuditCompare,
  restoreAdminAuditVersion,
} from '../data/adminAuditService'
import type { AdminAuditCompareDetail } from '@/schemas/adminAudit'
import { ADMIN_AUDIT_FONT } from '../adminAuditStyles'

interface AdminAuditCompareContentProps {
  reportId: string
}

export default function AdminAuditCompareContent({ reportId }: AdminAuditCompareContentProps) {
  const [loading, setLoading] = useState(true)
  const [restoring, setRestoring] = useState(false)
  const [detail, setDetail] = useState<AdminAuditCompareDetail | null>(null)

  const loadCompare = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAdminAuditCompare(reportId)
      setDetail(data)
    } catch {
      toast.error('تعذّر تحميل مقارنة التغييرات')
    } finally {
      setLoading(false)
    }
  }, [reportId])

  useEffect(() => {
    loadCompare()
  }, [loadCompare])

  async function handleExport() {
    try {
      await exportAdminAuditReport(reportId)
      toast.success('تم تصدير التقرير', { position: 'top-center' })
    } catch {
      toast.error('تعذّر تصدير التقرير')
    }
  }

  async function handleRestore() {
    if (!detail?.versions[0]) return
    setRestoring(true)
    try {
      await restoreAdminAuditVersion(reportId, detail.versions[0].id)
      toast.success('تمت استعادة بيانات الإصدار', { position: 'top-center' })
    } catch {
      toast.error('تعذّر استعادة الإصدار')
    } finally {
      setRestoring(false)
    }
  }

  return (
    <AdminShell activeNav="audit">
      <AdminAuditBackButton />

      {loading ? (
        <div
          className="flex min-h-[40vh] items-center justify-center"
          style={{ fontFamily: ADMIN_AUDIT_FONT }}
        >
          <p className="text-sm font-medium text-[#64748B]">جاري التحميل...</p>
        </div>
      ) : detail ? (
        <>
          <AdminAuditPageHeader
            title={detail.title}
            subtitle={detail.subtitle}
            action={
              <AdminAuditPrimaryButton onClick={handleExport}>
                <span className="inline-flex items-center justify-center gap-1.5">
                  <Download size={16} />
                  تصدير التقرير
                </span>
              </AdminAuditPrimaryButton>
            }
          />

          <div className="flex flex-col gap-4" dir="rtl">
            {detail.changes.map((field) => (
              <AdminAuditCompareSection key={field.id} field={field} />
            ))}

            <AdminAuditRecoverySummary
              bullets={detail.recoveryBullets}
              warning={detail.recoveryWarning}
              footerNote={detail.recoveryFooterNote}
              onRestore={handleRestore}
              restoring={restoring}
            />

            <AdminAuditVersionLog versions={detail.versions} />
          </div>
        </>
      ) : null}
    </AdminShell>
  )
}
