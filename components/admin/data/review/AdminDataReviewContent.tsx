'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import AdminShell from '../../AdminShell'
import AdminDataReviewHeader from './AdminDataReviewHeader'
import AdminDataReviewActionsPanel from './AdminDataReviewActionsPanel'
import AdminDataFacilityInfoCard from './AdminDataFacilityInfoCard'
import AdminDataInventoryCard from './AdminDataInventoryCard'
import AdminDataServicesCard from './AdminDataServicesCard'
import AdminDataUploadCard from './AdminDataUploadCard'
import AdminDataSourceNotesCard from './AdminDataSourceNotesCard'
import AdminDataAuditLog from './AdminDataAuditLog'
import {
  downloadAdminDataReviewReport,
  fetchAdminDataReview,
  submitAdminDataReview,
} from '../data/adminDataService'
import type { AdminDataReviewDecision, AdminDataReviewDetail } from '@/schemas/adminData'
import { ADMIN_DATA_FONT } from '../adminDataStyles'

interface AdminDataReviewContentProps {
  requestId: string
}

export default function AdminDataReviewContent({ requestId }: AdminDataReviewContentProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [detail, setDetail] = useState<AdminDataReviewDetail | null>(null)

  const loadReview = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAdminDataReview(requestId)
      setDetail(data)
    } catch {
      toast.error('تعذّر تحميل تفاصيل الطلب')
    } finally {
      setLoading(false)
    }
  }, [requestId])

  useEffect(() => {
    loadReview()
  }, [loadReview])

  async function handleSubmit(
    notes: string,
    decision: AdminDataReviewDecision,
    mode: 'draft' | 'publish'
  ) {
    setSaving(true)
    try {
      const updated = await submitAdminDataReview(requestId, { notes, decision }, mode)
      setDetail(updated)
      toast.success(
        mode === 'draft' ? 'تم حفظ المسودة' : 'تم اعتماد ونشر البيانات',
        { position: 'top-center' }
      )
      if (mode === 'publish') {
        router.push('/admin/data')
      }
    } catch {
      toast.error('تعذّر حفظ المراجعة')
    } finally {
      setSaving(false)
    }
  }

  async function handleDownload() {
    try {
      await downloadAdminDataReviewReport(requestId)
      toast.success('تم تنزيل التقرير', { position: 'top-center' })
    } catch {
      toast.error('تعذّر تنزيل التقرير')
    }
  }

  return (
    <AdminShell activeNav="data">
      <button
        type="button"
        onClick={() => router.push('/admin/data')}
        className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] transition-colors hover:text-[#2196F3] sm:text-sm"
        style={{ fontFamily: ADMIN_DATA_FONT }}
        dir="rtl"
      >
        <ArrowRight size={16} />
        العودة إلى نظرة عامة على البيانات
      </button>

      {loading ? (
        <div
          className="flex min-h-[40vh] items-center justify-center"
          style={{ fontFamily: ADMIN_DATA_FONT }}
        >
          <p className="text-sm font-medium text-[#64748B]">جاري التحميل...</p>
        </div>
      ) : detail ? (
        <>
          <AdminDataReviewHeader
            title={detail.title}
            requestCode={detail.requestCode}
            submittedAgo={detail.submittedAgo}
            onDownload={handleDownload}
          />

          <div
            className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start"
            dir="rtl"
          >
            <div className="flex flex-col gap-4 lg:col-span-8">
              <AdminDataFacilityInfoCard detail={detail} />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <AdminDataServicesCard services={detail.services} />
                <AdminDataInventoryCard items={detail.inventory} />
              </div>
              <AdminDataUploadCard />
              <AdminDataSourceNotesCard notes={detail.sourceNotes} />
            </div>

            <div className="flex flex-col gap-4 lg:col-span-4">
              <AdminDataReviewActionsPanel
                saving={saving}
                onSaveDraft={(notes, decision) => handleSubmit(notes, decision, 'draft')}
                onPublish={(notes, decision) => handleSubmit(notes, decision, 'publish')}
              />
              <AdminDataAuditLog entries={detail.auditLog} />
            </div>
          </div>
        </>
      ) : null}
    </AdminShell>
  )
}
