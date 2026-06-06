'use client'

import type { AdminDataSyncRequest } from '@/schemas/adminData'
import {
  ADMIN_DATA_BLUE,
  ADMIN_DATA_CARD_SHADOW,
  ADMIN_DATA_FONT,
  ADMIN_DATA_PRIORITY_LABELS,
} from '../adminDataStyles'

interface AdminDataSyncRequestsTableProps {
  requests: AdminDataSyncRequest[]
  publishingId?: string | null
  onPublish?: (request: AdminDataSyncRequest) => void | Promise<void>
}

function splitAcceptedAt(acceptedAt: string) {
  const parts = acceptedAt.trim().split(/\s+/)
  if (parts.length >= 3) {
    return {
      day: parts.slice(0, -2).join(' '),
      time: parts.slice(-2).join(' '),
    }
  }
  if (parts.length === 2) {
    return { day: parts[0], time: parts[1] }
  }
  return { day: acceptedAt, time: '' }
}

export default function AdminDataSyncRequestsTable({
  requests,
  publishingId = null,
  onPublish,
}: AdminDataSyncRequestsTableProps) {
  return (
    <section
      className="overflow-hidden rounded-xl border border-[#E8EEF5] bg-white"
      style={{ boxShadow: ADMIN_DATA_CARD_SHADOW }}
      dir="rtl"
    >
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[680px] text-right">
          <thead>
            <tr className="border-y border-[#E3F2FD] bg-[#E3F2FD]">
              {['المعرف', 'نوع البيانات', 'تاريخ القبول', 'الأولوية', 'الإجراء'].map(
                (col) => (
                  <th
                    key={col}
                    className="px-5 py-3 text-xs font-bold text-[#64748B]"
                    style={{ fontFamily: ADMIN_DATA_FONT }}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {requests.map((row) => {
              const priority = ADMIN_DATA_PRIORITY_LABELS[row.priority]
              const { day, time } = splitAcceptedAt(row.acceptedAt)
              return (
                <tr key={row.id} className="border-b border-[#E8EEF5] last:border-b-0">
                  <td className="px-5 py-3.5">
                    <p
                      className="text-sm font-bold text-[#0F172A]"
                      style={{ fontFamily: ADMIN_DATA_FONT }}
                    >
                      #{row.code}
                    </p>
                    <p
                      className="mt-0.5 text-xs font-medium text-[#64748B]"
                      style={{ fontFamily: ADMIN_DATA_FONT }}
                    >
                      موقع: {row.location}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-sm font-medium text-[#0F172A]"
                      style={{ fontFamily: ADMIN_DATA_FONT }}
                    >
                      {row.dataType}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p
                      className="text-sm font-medium text-[#0F172A]"
                      style={{ fontFamily: ADMIN_DATA_FONT }}
                    >
                      {day}
                    </p>
                    {time ? (
                      <p
                        className="mt-0.5 text-xs font-medium text-[#64748B]"
                        style={{ fontFamily: ADMIN_DATA_FONT }}
                      >
                        {time}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-bold"
                      style={{
                        fontFamily: ADMIN_DATA_FONT,
                        color: priority.color,
                        background: priority.bg,
                      }}
                    >
                      {priority.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      disabled={publishingId === row.id}
                      onClick={() => onPublish?.(row)}
                      className="text-sm font-bold transition-opacity hover:opacity-80 disabled:opacity-50"
                      style={{ fontFamily: ADMIN_DATA_FONT, color: ADMIN_DATA_BLUE }}
                    >
                      {publishingId === row.id ? 'جاري النشر...' : 'نشر الآن'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 p-4 md:hidden">
        {requests.map((row) => {
          const priority = ADMIN_DATA_PRIORITY_LABELS[row.priority]
          const { day, time } = splitAcceptedAt(row.acceptedAt)
          return (
            <article
              key={row.id}
              className="rounded-xl border border-[#E8EEF5] bg-[#FAFBFC] p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    fontFamily: ADMIN_DATA_FONT,
                    color: priority.color,
                    background: priority.bg,
                  }}
                >
                  {priority.label}
                </span>
                <div className="text-right">
                  <p
                    className="text-sm font-bold text-[#0F172A]"
                    style={{ fontFamily: ADMIN_DATA_FONT }}
                  >
                    #{row.code}
                  </p>
                  <p
                    className="text-xs text-[#64748B]"
                    style={{ fontFamily: ADMIN_DATA_FONT }}
                  >
                    موقع: {row.location}
                  </p>
                </div>
              </div>
              <p
                className="text-right text-sm font-medium text-[#0F172A]"
                style={{ fontFamily: ADMIN_DATA_FONT }}
              >
                {row.dataType}
              </p>
              <p
                className="mt-1 text-right text-sm font-medium text-[#0F172A]"
                style={{ fontFamily: ADMIN_DATA_FONT }}
              >
                {day}
              </p>
              {time ? (
                <p
                  className="text-right text-xs text-[#64748B]"
                  style={{ fontFamily: ADMIN_DATA_FONT }}
                >
                  {time}
                </p>
              ) : null}
              <button
                type="button"
                disabled={publishingId === row.id}
                onClick={() => onPublish?.(row)}
                className="mt-3 w-full rounded-xl py-2.5 text-xs font-bold text-white disabled:opacity-50"
                style={{ background: ADMIN_DATA_BLUE, fontFamily: ADMIN_DATA_FONT }}
              >
                {publishingId === row.id ? 'جاري النشر...' : 'نشر الآن'}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
