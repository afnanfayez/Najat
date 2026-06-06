'use client'

import { AlertTriangle, History } from 'lucide-react'
import {
  ADMIN_AUDIT_BLUE,
  ADMIN_AUDIT_CARD_SHADOW,
  ADMIN_AUDIT_CARD_SHELL,
  ADMIN_AUDIT_FONT,
} from '../adminAuditStyles'

interface AdminAuditRecoverySummaryProps {
  bullets: string[]
  warning: string
  footerNote?: string
  onRestore?: () => void
  restoring?: boolean
}

export default function AdminAuditRecoverySummary({
  bullets,
  warning,
  footerNote = 'يتطلب هذا الإجراء صلاحيات مدير النظام للتحقق من الهوية',
  onRestore,
  restoring = false,
}: AdminAuditRecoverySummaryProps) {
  return (
    <section
      className={`grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 ${ADMIN_AUDIT_CARD_SHELL}`}
      style={{ boxShadow: ADMIN_AUDIT_CARD_SHADOW }}
      dir="rtl"
    >
      <div className="text-right">
        <h3
          className="mb-4 text-sm font-bold text-[#0F172A] sm:text-base"
          style={{ fontFamily: ADMIN_AUDIT_FONT }}
        >
          ملخص أثر الاستعادة
        </h3>
        <ul className="space-y-3">
          {bullets.map((text) => (
            <li
              key={text}
              className="flex items-start justify-start gap-2.5 text-right text-xs leading-7 sm:text-sm sm:leading-8"
              style={{ fontFamily: ADMIN_AUDIT_FONT, color: ADMIN_AUDIT_BLUE }}
            >
              <span
                className="mt-2 h-2 w-2 shrink-0 rounded-full"
                style={{ background: ADMIN_AUDIT_BLUE }}
              />
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-[#FECACA] bg-[#FFFBFB] p-4 sm:p-5">
        <div className="mb-2 flex items-center justify-start gap-2">
          <AlertTriangle size={18} className="shrink-0 text-[#EF4444]" strokeWidth={2.5} />
          <h4
            className="text-right text-sm font-bold text-[#EF4444]"
            style={{ fontFamily: ADMIN_AUDIT_FONT }}
          >
            تحذير أمني واستعادة
          </h4>
        </div>
        <p
          className="mb-4 text-right text-xs leading-7 text-[#EF4444] sm:text-sm sm:leading-8"
          style={{ fontFamily: ADMIN_AUDIT_FONT }}
        >
          {warning}
        </p>
        <button
          type="button"
          disabled={restoring}
          onClick={onRestore}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: ADMIN_AUDIT_BLUE, fontFamily: ADMIN_AUDIT_FONT }}
        >
          <History size={18} strokeWidth={2.5} />
          {restoring ? 'جاري الاستعادة...' : 'استعادة بيانات هذا الإصدار'}
        </button>
        <p
          className="mt-3 text-center text-[11px] font-medium text-[#94A3B8] sm:text-xs"
          style={{ fontFamily: ADMIN_AUDIT_FONT }}
        >
          {footerNote}
        </p>
      </div>
    </section>
  )
}
