'use client'

import { Eye, ShieldCheck, Trash2 } from 'lucide-react'
import type { AdminDataRequest } from '@/schemas/adminData'
import {
  ADMIN_DATA_BLUE,
  ADMIN_DATA_CARD_SHADOW,
  ADMIN_DATA_FONT,
  ADMIN_DATA_INPUT_BG,
  ADMIN_DATA_STATUS_LABELS,
} from './adminDataStyles'

interface AdminDataRequestCardProps {
  request: AdminDataRequest
  busy?: boolean
  onReview?: (request: AdminDataRequest) => void
  onApprove?: (request: AdminDataRequest) => void | Promise<void>
  onDelete?: (request: AdminDataRequest) => void | Promise<void>
}

export default function AdminDataRequestCard({
  request,
  busy = false,
  onReview,
  onApprove,
  onDelete,
}: AdminDataRequestCardProps) {
  const status = ADMIN_DATA_STATUS_LABELS[request.status]

  return (
    <article
      className="flex h-full flex-col rounded-xl border border-[#E8EEF5] bg-white p-5 sm:p-6"
      style={{ boxShadow: ADMIN_DATA_CARD_SHADOW }}
      dir="rtl"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 text-right">
          <h3
            className="text-lg font-bold leading-snug sm:text-xl"
            style={{ color: ADMIN_DATA_BLUE, fontFamily: ADMIN_DATA_FONT }}
          >
            {request.title}
          </h3>
          <p
            className="mt-1 text-sm font-medium text-[#94A3B8]"
            style={{ fontFamily: ADMIN_DATA_FONT }}
          >
            {request.subtitle}
          </p>
        </div>
        <span
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
          style={{
            fontFamily: ADMIN_DATA_FONT,
            color: status.color,
            background: status.bg,
          }}
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: status.dot }}
          />
          {status.label}
        </span>
      </div>

      <p
        className="mb-5 flex-1 text-right text-sm leading-7 text-[#1E293B] sm:text-[15px] sm:leading-8"
        style={{ fontFamily: ADMIN_DATA_FONT }}
      >
        {request.description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3">
        <div
          className="shrink-0 rounded-xl px-4 py-2.5"
          style={{ background: ADMIN_DATA_INPUT_BG }}
        >
          <p
            className="whitespace-nowrap text-right text-sm font-bold"
            style={{ color: ADMIN_DATA_BLUE, fontFamily: ADMIN_DATA_FONT }}
          >
            {request.volunteerName}
          </p>
          <p
            className="mt-0.5 whitespace-nowrap text-right text-xs font-medium text-[#64B5F6]"
            style={{ fontFamily: ADMIN_DATA_FONT }}
          >
            {request.submittedAt}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onReview?.(request)}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: ADMIN_DATA_BLUE, fontFamily: ADMIN_DATA_FONT }}
          >
            <Eye size={18} strokeWidth={2.5} />
            مراجعة
          </button>
          <button
            type="button"
            aria-label="حذف"
            disabled={busy}
            onClick={() => onDelete?.(request)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEE2E2] text-[#EF4444] transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            <Trash2 size={18} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="اعتماد"
            disabled={busy}
            onClick={() => onApprove?.(request)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F5E9] text-[#22C55E] transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            <ShieldCheck size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
  )
}
