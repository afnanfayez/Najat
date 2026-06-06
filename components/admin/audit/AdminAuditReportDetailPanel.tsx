'use client'

import { useEffect, useState } from 'react'
import { Eye, Pencil, Star, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { AdminAuditReport, UpdateAdminAuditReportBody } from '@/schemas/adminAudit'
import {
  ADMIN_AUDIT_BLUE,
  ADMIN_AUDIT_CARD_SHADOW,
  ADMIN_AUDIT_FONT,
  ADMIN_AUDIT_INPUT_BG,
} from './adminAuditStyles'

interface AdminAuditReportDetailPanelProps {
  report: AdminAuditReport | null
  busy?: boolean
  onSave?: (
    report: AdminAuditReport,
    body: UpdateAdminAuditReportBody
  ) => void | Promise<void>
  onReject?: (report: AdminAuditReport) => void | Promise<void>
}

const inputClassName =
  'w-full rounded-lg border border-[#E8EEF5] px-3 py-2 text-sm font-bold text-[#0F172A] outline-none focus:border-[#2196F3]'

export default function AdminAuditReportDetailPanel({
  report,
  busy = false,
  onSave,
  onReject,
}: AdminAuditReportDetailPanelProps) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<UpdateAdminAuditReportBody>({})

  useEffect(() => {
    setEditing(false)
    if (report) {
      setDraft({
        issueType: report.issueType,
        targetLocation: report.targetLocation,
        reporter: report.reporter,
        reportDate: report.reportDate,
      })
    }
  }, [report?.id])

  if (!report) {
    return (
      <aside
        className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-xl border border-[#E8EEF5] bg-white p-4 sm:p-5"
        style={{ boxShadow: ADMIN_AUDIT_CARD_SHADOW }}
        dir="rtl"
      >
        <p
          className="text-center text-sm font-medium text-[#94A3B8]"
          style={{ fontFamily: ADMIN_AUDIT_FONT }}
        >
          اختر بلاغاً من الجدول لعرض التفاصيل
        </p>
      </aside>
    )
  }

  const fields = [
    { key: 'targetLocation' as const, label: 'الموقع المستهدف' },
    { key: 'reporter' as const, label: 'المُبلِغ' },
    { key: 'reportDate' as const, label: 'تاريخ الإبلاغ' },
  ]

  async function handleSave() {
    if (!report) return
    try {
      await onSave?.(report, {
        ...draft,
        facilityName: draft.targetLocation,
      })
      setEditing(false)
    } catch {
      // يبقى في وضع التعديل عند الفشل
    }
  }

  function handleCancelEdit() {
    if (!report) return
    setDraft({
      issueType: report.issueType,
      targetLocation: report.targetLocation,
      reporter: report.reporter,
      reportDate: report.reportDate,
    })
    setEditing(false)
  }

  return (
    <aside
      className="flex h-full w-full min-h-0 flex-col rounded-xl border border-[#E8EEF5] bg-white p-4 sm:p-5"
      style={{ boxShadow: ADMIN_AUDIT_CARD_SHADOW }}
      dir="rtl"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        {editing ? (
          <input
            value={draft.issueType ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, issueType: e.target.value }))}
            className={`min-w-0 flex-1 text-right ${inputClassName}`}
            style={{ fontFamily: ADMIN_AUDIT_FONT, background: ADMIN_AUDIT_INPUT_BG }}
          />
        ) : (
          <h2
            className="min-w-0 flex-1 text-right text-base font-bold text-[#0F172A] sm:text-lg"
            style={{ fontFamily: ADMIN_AUDIT_FONT }}
          >
            {report.issueType}
          </h2>
        )}
        {report.isUrgent && !editing && (
          <span
            className="inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold text-[#EF4444]"
            style={{ fontFamily: ADMIN_AUDIT_FONT, background: '#FEE2E2' }}
          >
            بلاغ عاجل
          </span>
        )}
      </div>

      <dl className="mb-4 space-y-2.5">
        {fields.map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-3">
            <dt
              className="shrink-0 text-sm font-bold text-[#2196F3]"
              style={{ fontFamily: ADMIN_AUDIT_FONT }}
            >
              {item.label}:
            </dt>
            {editing ? (
              <input
                value={draft[item.key] ?? ''}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [item.key]: e.target.value }))
                }
                className={`min-w-0 flex-1 text-left ${inputClassName}`}
                style={{ fontFamily: ADMIN_AUDIT_FONT, background: ADMIN_AUDIT_INPUT_BG }}
              />
            ) : (
              <dd
                className="min-w-0 text-left text-sm font-bold text-[#0F172A]"
                style={{ fontFamily: ADMIN_AUDIT_FONT }}
              >
                {report[item.key]}
              </dd>
            )}
          </div>
        ))}
      </dl>

      {editing && (
        <div className="mb-3 flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={handleSave}
            className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-50"
            style={{ background: ADMIN_AUDIT_BLUE, fontFamily: ADMIN_AUDIT_FONT }}
          >
            {busy ? 'جاري الحفظ...' : 'حفظ التعديل'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleCancelEdit}
            className="flex-1 rounded-xl border border-[#E8EEF5] py-2.5 text-sm font-bold text-[#64748B] disabled:opacity-50"
            style={{ fontFamily: ADMIN_AUDIT_FONT }}
          >
            إلغاء
          </button>
        </div>
      )}

      <div className="border-t border-[#E8EEF5] pt-4">
        <p
          className="mb-3 text-right text-sm font-bold text-[#2196F3]"
          style={{ fontFamily: ADMIN_AUDIT_FONT }}
        >
          إجراءات سريعة
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            disabled={busy || editing}
            onClick={() => router.push(`/admin/audit/${report.id}`)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: ADMIN_AUDIT_BLUE, fontFamily: ADMIN_AUDIT_FONT }}
          >
            <Eye size={18} strokeWidth={2.5} />
            مراجعة تفصيلية
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => (editing ? handleCancelEdit() : setEditing(true))}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:text-sm"
              style={{ fontFamily: ADMIN_AUDIT_FONT, background: ADMIN_AUDIT_BLUE }}
            >
              <Pencil size={16} strokeWidth={2.5} />
              {editing ? 'إلغاء التعديل' : 'تعديل مباشر'}
            </button>
            <button
              type="button"
              disabled={busy || editing}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:text-sm"
              style={{ fontFamily: ADMIN_AUDIT_FONT, background: '#22C55E' }}
            >
              <Star size={16} strokeWidth={2.5} />
              صرف مكافأة
            </button>
          </div>

          <button
            type="button"
            disabled={busy || editing}
            onClick={() => onReject?.(report)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ fontFamily: ADMIN_AUDIT_FONT, background: '#EF4444' }}
          >
            <Trash2 size={18} strokeWidth={2.5} />
            {busy ? 'جاري الرفض...' : 'رفض البلاغ'}
          </button>
        </div>
      </div>

      {report.reviewer && !editing && (
        <p
          className="mt-4 flex items-center justify-start gap-2 text-right text-xs font-medium text-[#64B5F6]"
          style={{ fontFamily: ADMIN_AUDIT_FONT }}
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: ADMIN_AUDIT_BLUE }}
          />
          يتم مراجعته الآن من قبل «{report.reviewer}»
        </p>
      )}
    </aside>
  )
}
