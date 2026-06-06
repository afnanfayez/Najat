'use client'

import Image from 'next/image'
import { Clock, MapPin, SquarePen } from 'lucide-react'
import type { AdminCommunicationTask } from '@/schemas/adminCommunication'
import {
  ADMIN_COMM_BLUE,
  ADMIN_COMM_CARD_SHADOW,
  ADMIN_COMM_CARD_SHELL,
  ADMIN_COMM_FONT,
  ADMIN_COMM_TASK_BADGE,
} from './adminCommunicationStyles'

interface AdminCommunicationTaskCardProps {
  task: AdminCommunicationTask
  onEdit?: (task: AdminCommunicationTask) => void
}

export default function AdminCommunicationTaskCard({
  task,
  onEdit,
}: AdminCommunicationTaskCardProps) {
  const badge = ADMIN_COMM_TASK_BADGE[task.badgeTone]

  return (
    <article
      className={`flex h-full min-w-0 flex-col ${ADMIN_COMM_CARD_SHELL}`}
      style={{ boxShadow: ADMIN_COMM_CARD_SHADOW }}
      dir="rtl"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <span
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold sm:px-3 sm:text-xs"
          style={{
            fontFamily: ADMIN_COMM_FONT,
            color: badge.color,
            background: badge.bg,
          }}
        >
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: badge.dot }}
          />
          {task.badgeLabel}
        </span>
        <span
          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#94A3B8] sm:text-xs"
          style={{ fontFamily: ADMIN_COMM_FONT }}
        >
          <Clock size={14} className="shrink-0" strokeWidth={2.5} />
          {task.timeLabel}
        </span>
      </div>

      <h3
        className="mb-3 break-words text-right text-base font-bold leading-snug sm:text-lg"
        style={{ color: ADMIN_COMM_BLUE, fontFamily: ADMIN_COMM_FONT }}
      >
        {task.title}
      </h3>

      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-start gap-2">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full sm:h-9 sm:w-9">
              <Image
                src={task.assigneeAvatar}
                alt={task.assigneeName}
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <div className="min-w-0 flex-1 text-right">
              <p
                className="truncate text-sm font-bold text-[#0F172A]"
                style={{ fontFamily: ADMIN_COMM_FONT }}
              >
                {task.assigneeName}
              </p>
              <div
                className="mt-0.5 flex flex-wrap items-center justify-start gap-x-2 gap-y-0.5 text-[11px] font-medium text-[#64748B] sm:text-xs"
                style={{ fontFamily: ADMIN_COMM_FONT }}
              >
                <span className="shrink-0 text-[#94A3B8]">{task.assigneeRole}</span>
                <span className="inline-flex min-w-0 items-center gap-1">
                  <MapPin size={12} className="shrink-0 text-[#94A3B8]" strokeWidth={2.5} />
                  <span className="truncate">{task.location}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="تعديل"
          onClick={() => onEdit?.(task)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E3F2FD] bg-[#F8FBFF] text-[#2196F3] transition-opacity hover:opacity-80 sm:h-9 sm:w-9"
        >
          <SquarePen size={16} strokeWidth={2.5} />
        </button>
      </div>
    </article>
  )
}
