'use client'

import type { AdminAuditVersionEntry } from '@/schemas/adminAudit'
import {
  ADMIN_AUDIT_BLUE,
  ADMIN_AUDIT_CARD_SHADOW,
  ADMIN_AUDIT_CARD_SHELL,
  ADMIN_AUDIT_FONT,
  ADMIN_AUDIT_VERSION_BADGE,
} from '../adminAuditStyles'

interface AdminAuditVersionLogProps {
  versions: AdminAuditVersionEntry[]
  subtitle?: string
}

export default function AdminAuditVersionLog({
  versions,
  subtitle = 'اختر إصداراً للمقارنة مع البيانات الحالية للمنشأة.',
}: AdminAuditVersionLogProps) {
  return (
    <section
      className={ADMIN_AUDIT_CARD_SHELL}
      style={{ boxShadow: ADMIN_AUDIT_CARD_SHADOW }}
      dir="rtl"
    >
      <div className="mb-4 text-right">
        <h3
          className="text-sm font-bold text-[#0F172A] sm:text-base"
          style={{ fontFamily: ADMIN_AUDIT_FONT }}
        >
          سجل الإصدارات
        </h3>
        <p
          className="mt-1 text-xs font-medium text-[#94A3B8] sm:text-sm"
          style={{ fontFamily: ADMIN_AUDIT_FONT }}
        >
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {versions.map((version) => {
          const badgeStyle = ADMIN_AUDIT_VERSION_BADGE[version.badgeTone]
          const isCurrent = version.badgeTone === 'current'

          return (
            <article
              key={version.id}
              className="rounded-2xl border border-[#E8EEF5] bg-white p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span
                  className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold"
                  style={{
                    fontFamily: ADMIN_AUDIT_FONT,
                    color: isCurrent ? '#FFFFFF' : badgeStyle.color,
                    background: isCurrent ? ADMIN_AUDIT_BLUE : badgeStyle.bg,
                  }}
                >
                  {version.badge}
                </span>
                <span
                  className="text-[11px] font-medium text-[#94A3B8] sm:text-xs"
                  style={{ fontFamily: ADMIN_AUDIT_FONT }}
                >
                  {version.timestamp}
                </span>
              </div>

              <p
                className="mb-3 text-right text-sm font-bold text-[#0F172A]"
                style={{ fontFamily: ADMIN_AUDIT_FONT }}
              >
                ID: {version.versionCode}
              </p>

              <div className="flex items-center justify-start gap-2">
                <span
                  className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ background: '#E3F2FD' }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: ADMIN_AUDIT_BLUE }}
                  />
                </span>
                <p
                  className="text-right text-xs font-medium text-[#64748B]"
                  style={{ fontFamily: ADMIN_AUDIT_FONT }}
                >
                  بواسطة: {version.changedBy}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
