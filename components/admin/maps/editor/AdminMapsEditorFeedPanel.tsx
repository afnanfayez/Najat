'use client'

import { toast } from 'sonner'
import type {
  AdminMapsFieldReport,
  AdminMapsQuickAction,
  AdminMapsVerificationRequest,
} from '@/schemas/adminMaps'
import { ADMIN_MAPS_BLUE, ADMIN_MAPS_FONT } from '../adminMapsStyles'

const TAG_STYLES = {
  danger: { color: '#EF4444', bg: '#FEE2E2' },
  warning: { color: '#FF9800', bg: '#FFF3E0' },
} as const

const ACTION_DOT_COLORS: Record<AdminMapsQuickAction['type'], string> = {
  update: '#2196F3',
  delete: '#FF9800',
  add: '#EF4444',
}

interface AdminMapsEditorFeedPanelProps {
  verificationRequests: AdminMapsVerificationRequest[]
  fieldReports: AdminMapsFieldReport[]
  quickActions: AdminMapsQuickAction[]
}

export default function AdminMapsEditorFeedPanel({
  verificationRequests,
  fieldReports,
  quickActions,
}: AdminMapsEditorFeedPanelProps) {
  return (
    <aside
      className="flex h-auto flex-col gap-4 rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:gap-5 sm:p-5 xl:h-full"
      dir="rtl"
    >
      <section>
        <h2
          className="mb-3 text-right text-sm font-bold text-[#0F172A] sm:text-base"
          style={{ fontFamily: ADMIN_MAPS_FONT }}
        >
          طلبات التحقق المعلقة
        </h2>
        <div className="custom-scrollbar max-h-[240px] space-y-3 overflow-y-auto pr-1 sm:max-h-[320px]">
          {verificationRequests.map((request) => {
            const tagStyle = TAG_STYLES[request.tagVariant]
            return (
              <article
                key={request.id}
                className="rounded-2xl border border-[#E8EEF5] bg-[#FAFBFC] p-4"
              >
                <div className="mb-2 flex justify-start">
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                    style={{
                      fontFamily: ADMIN_MAPS_FONT,
                      color: tagStyle.color,
                      background: tagStyle.bg,
                    }}
                  >
                    {request.tag}
                  </span>
                </div>
                <h3
                  className="text-right text-sm font-bold text-[#2196F3]"
                  style={{ fontFamily: ADMIN_MAPS_FONT }}
                >
                  {request.title}
                </h3>
                <p
                  className="mt-2 text-right text-xs leading-6 text-[#64748B]"
                  style={{ fontFamily: ADMIN_MAPS_FONT }}
                >
                  {request.description}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    toast.info('عرض الموقع على الخريطة — قريباً', {
                      position: 'top-center',
                    })
                  }
                  className="mt-3 w-full rounded-xl py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: ADMIN_MAPS_BLUE, fontFamily: ADMIN_MAPS_FONT }}
                >
                  عرض الموقع
                </button>
              </article>
            )
          })}
        </div>
      </section>

      <div className="h-px bg-[#E8EEF5]" />

      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2
            className="text-right text-sm font-bold text-[#2196F3] sm:text-base"
            style={{ fontFamily: ADMIN_MAPS_FONT }}
          >
            تقارير الميدان الأخيرة
          </h2>
          <button
            type="button"
            onClick={() => toast.info('عرض كل التقارير — قريباً', { position: 'top-center' })}
            className="shrink-0 text-xs font-bold text-[#2196F3]"
            style={{ fontFamily: ADMIN_MAPS_FONT }}
          >
            عرض الكل
          </button>
        </div>
        <div className="space-y-4">
          {fieldReports.map((report) => (
            <div key={report.id}>
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-sm font-bold text-[#0F172A]"
                  style={{ fontFamily: ADMIN_MAPS_FONT }}
                >
                  {report.author}
                </span>
                <span
                  className="text-xs font-medium text-[#94A3B8]"
                  style={{ fontFamily: ADMIN_MAPS_FONT }}
                >
                  {report.time}
                </span>
              </div>
              <p
                className="mt-1 text-right text-xs leading-6 text-[#64748B]"
                style={{ fontFamily: ADMIN_MAPS_FONT }}
              >
                {report.message}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px bg-[#E8EEF5]" />

      <section>
        <h2
          className="mb-3 text-right text-sm font-bold text-[#2196F3] sm:text-base"
          style={{ fontFamily: ADMIN_MAPS_FONT }}
        >
          سجل الإجراءات السريعة
        </h2>
        <div className="space-y-3">
          {quickActions.map((action) => (
            <div key={action.id} className="flex items-start justify-start gap-2.5">
              <span
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: ACTION_DOT_COLORS[action.type] }}
              />
              <p
                className="text-right text-xs leading-6 text-[#64748B]"
                style={{ fontFamily: ADMIN_MAPS_FONT }}
              >
                {action.message}
              </p>
            </div>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={() =>
          toast.info('سجل التدقيق الكامل — قريباً', { position: 'top-center' })
        }
        className="mt-auto w-full rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
        style={{ background: ADMIN_MAPS_BLUE, fontFamily: ADMIN_MAPS_FONT }}
      >
        سجل التدقيق الكامل
      </button>
    </aside>
  )
}
