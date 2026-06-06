'use client'

import Image from 'next/image'
import { AlertTriangle, CheckCircle2, Users } from 'lucide-react'
import type { AdminAuditCompareField } from '@/schemas/adminAudit'
import {
  ADMIN_AUDIT_BLUE,
  ADMIN_AUDIT_CARD_SHADOW,
  ADMIN_AUDIT_CARD_SHELL,
  ADMIN_AUDIT_CHANGE_STATUS_LABELS,
  ADMIN_AUDIT_FONT,
  ADMIN_AUDIT_VALUE_TONES,
} from '../adminAuditStyles'

interface AdminAuditCompareSectionProps {
  field: AdminAuditCompareField
}

function ValueIcon({ tone }: { tone: keyof typeof ADMIN_AUDIT_VALUE_TONES }) {
  if (tone === 'success') {
    return <CheckCircle2 size={20} strokeWidth={2.5} className="shrink-0" />
  }
  if (tone === 'warning') {
    return <AlertTriangle size={20} strokeWidth={2.5} className="shrink-0" />
  }
  return <Users size={20} strokeWidth={2.5} className="shrink-0" />
}

export default function AdminAuditCompareSection({ field }: AdminAuditCompareSectionProps) {
  const badge = ADMIN_AUDIT_CHANGE_STATUS_LABELS[field.changeStatus]

  return (
    <section
      className={`overflow-hidden ${ADMIN_AUDIT_CARD_SHELL}`}
      style={{ boxShadow: ADMIN_AUDIT_CARD_SHADOW }}
      dir="rtl"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3
          className="text-right text-sm font-bold sm:text-base"
          style={{ fontFamily: ADMIN_AUDIT_FONT, color: ADMIN_AUDIT_BLUE }}
        >
          {field.title}
        </h3>
        <span
          className="inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-bold"
          style={{
            fontFamily: ADMIN_AUDIT_FONT,
            color: badge.color,
            background: badge.bg,
          }}
        >
          {badge.label}
        </span>
      </div>

      {field.type === 'images' ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {[
            {
              caption: field.previousImageCaption ?? field.previousLabel,
              src: field.previousImageUrl,
              alt: field.previousValue,
            },
            {
              caption: field.currentImageCaption ?? field.currentLabel,
              src: field.currentImageUrl,
              alt: field.currentValue,
            },
          ].map((side) => (
            <div key={side.caption} className="min-w-0">
              <div className="relative mb-1.5 h-[148px] overflow-hidden rounded-2xl bg-[#F1F5F9] sm:h-[168px]">
                {side.src ? (
                  <Image
                    src={side.src}
                    alt={side.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div
                    className="flex h-full items-center justify-center px-4 text-center text-sm font-bold text-[#94A3B8]"
                    style={{ fontFamily: ADMIN_AUDIT_FONT }}
                  >
                    {side.alt}
                  </div>
                )}
              </div>
              <p
                className="text-center text-xs font-bold text-[#64748B]"
                style={{ fontFamily: ADMIN_AUDIT_FONT }}
              >
                {side.caption}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {[
            {
              label: field.previousLabel,
              value: field.previousValue,
              toneKey: field.previousTone,
            },
            {
              label: field.currentLabel,
              value: field.currentValue,
              toneKey: field.currentTone,
            },
          ].map((side) => {
            const tone = ADMIN_AUDIT_VALUE_TONES[side.toneKey]
            return (
              <div
                key={side.label}
                className="flex items-center justify-start gap-2.5 rounded-[22px] px-4 py-2.5"
                style={{ background: tone.bg, color: tone.text }}
              >
                <ValueIcon tone={side.toneKey} />
                <div className="min-w-0 flex-1 text-right">
                  <p
                    className="mb-0.5 text-[11px] font-bold leading-tight"
                    style={{ fontFamily: ADMIN_AUDIT_FONT, color: tone.label }}
                  >
                    {side.label}
                  </p>
                  <p
                    className="text-sm font-bold leading-snug"
                    style={{ fontFamily: ADMIN_AUDIT_FONT, color: tone.text }}
                  >
                    {side.value}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
