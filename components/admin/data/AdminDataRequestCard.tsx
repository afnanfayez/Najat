'use client'

import { Eye, ShieldCheck, Trash2 } from 'lucide-react'
import type { AdminDataRequest } from '@/schemas/adminData'
import {
  ADMIN_DATA_BLUE,
  ADMIN_DATA_CARD_SHADOW,
  ADMIN_DATA_CARD_SHELL,
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
      className={`flex h-full min-w-0 flex-col ${ADMIN_DATA_CARD_SHELL}`}
      style={{ boxShadow: ADMIN_DATA_CARD_SHADOW }}
      dir="rtl"
    >
      <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0 flex-1 text-right">
          <h3
            className="text-base font-bold leading-snug sm:text-lg lg:text-xl"
            style={{ color: ADMIN_DATA_BLUE, fontFamily: ADMIN_DATA_FONT }}
          >
            {request.title}
          </h3>
          <p
            className="mt-1 text-xs font-medium text-[#94A3B8] sm:text-sm"
            style={{ fontFamily: ADMIN_DATA_FONT }}
          >
            {request.subtitle}
          </p>
        </div>
        <span
          className="inline-flex w-fit shrink-0 items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-[11px] font-bold sm:px-3 sm:py-1.5 sm:text-xs"
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
        className="mb-4 flex-1 text-right text-sm leading-6 text-[#1E293B] sm:mb-5 sm:text-[15px] sm:leading-7"
        style={{ fontFamily: ADMIN_DATA_FONT }}
      >
        {request.description}
      </p>

      <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="w-full rounded-xl px-3 py-2 sm:w-auto sm:px-4 sm:py-2.5"
          style={{ background: ADMIN_DATA_INPUT_BG }}
        >
          <p
            className="truncate text-right text-xs font-bold sm:text-sm"
            style={{ color: ADMIN_DATA_BLUE, fontFamily: ADMIN_DATA_FONT }}
          >
            {request.volunteerName}
          </p>
          <p
            className="mt-0.5 truncate text-right text-[11px] font-medium text-[#64B5F6] sm:text-xs"
            style={{ fontFamily: ADMIN_DATA_FONT }}
          >
            {request.submittedAt}
          </p>
        </div>

        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
          <button
            type="button"
            onClick={() => onReview?.(request)}
            disabled={busy}
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:min-h-0 sm:flex-none sm:px-5 sm:py-2.5 sm:text-sm"
            style={{ background: ADMIN_DATA_BLUE, fontFamily: ADMIN_DATA_FONT }}
          >
            <Eye size={16} strokeWidth={2.5} />
            مراجعة
          </button>
          <button
            type="button"
            aria-label="حذف"
            disabled={busy}
            onClick={() => onDelete?.(request)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FEE2E2] text-[#EF4444] transition-opacity hover:opacity-80 disabled:opacity-50 sm:h-10 sm:w-10"
          >
            <Trash2 size={17} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="اعتماد"
            disabled={busy}
            onClick={() => onApprove?.(request)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-[#22C55E] transition-opacity hover:opacity-80 disabled:opacity-50 sm:h-10 sm:w-10"
          >
            <ShieldCheck size={17} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
  )
}
