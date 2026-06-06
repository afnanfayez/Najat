'use client'

import { ChevronLeft } from 'lucide-react'
import type { AdminAuditFilterTab, AdminAuditReport } from '@/schemas/adminAudit'
import {
  ADMIN_AUDIT_BLUE,
  ADMIN_AUDIT_CARD_SHADOW,
  ADMIN_AUDIT_CLASSIFICATION_LABELS,
  ADMIN_AUDIT_FONT,
  ADMIN_AUDIT_PRIORITY_LABELS,
  ADMIN_AUDIT_STATUS_LABELS,
} from './adminAuditStyles'

const TABS: { id: AdminAuditFilterTab; label: string }[] = [
  { id: 'all', label: 'كل البلاغات' },
  { id: 'under_review', label: 'قيد المراجعة' },
  { id: 'archived', label: 'المؤرشفة' },
]

interface AdminAuditReportsTableProps {
  reports: AdminAuditReport[]
  activeTab: AdminAuditFilterTab
  selectedId?: string | null
  onTabChange?: (tab: AdminAuditFilterTab) => void
  onSelect?: (report: AdminAuditReport) => void
  className?: string
}

export default function AdminAuditReportsTable({
  reports,
  activeTab,
  selectedId = null,
  onTabChange,
  onSelect,
  className = '',
}: AdminAuditReportsTableProps) {
  return (
    <section
      className={`flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-[#E8EEF5] bg-white ${className}`}
      style={{ boxShadow: ADMIN_AUDIT_CARD_SHADOW }}
      dir="rtl"
    >
      <div className="border-b border-[#E3F2FD] bg-[#E3F2FD] px-4 py-3 sm:px-5">
        <div className="flex items-center justify-start gap-5 overflow-x-auto sm:gap-8">
          {TABS.map((tab) => {
            const selected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange?.(tab.id)}
                className="shrink-0 text-sm font-bold transition-colors sm:text-base"
                style={{
                  fontFamily: ADMIN_AUDIT_FONT,
                  color: selected ? ADMIN_AUDIT_BLUE : '#64748B',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[720px] text-right">
          <thead>
            <tr className="border-b border-[#E8EEF5] bg-white">
              {['المبلغ عنه', 'التصنيف', 'الأولوية', 'الحالة', 'الإجراءات'].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3.5 text-xs font-bold text-[#94A3B8] sm:px-5 sm:text-sm"
                  style={{ fontFamily: ADMIN_AUDIT_FONT }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((row) => {
              const status = ADMIN_AUDIT_STATUS_LABELS[row.status]
              const priority = ADMIN_AUDIT_PRIORITY_LABELS[row.priority]
              const classification = ADMIN_AUDIT_CLASSIFICATION_LABELS[row.classification]
              const selected = selectedId === row.id

              return (
                <tr
                  key={row.id}
                  className={`cursor-pointer border-b border-[#E8EEF5] transition-colors last:border-b-0 hover:bg-[#FAFBFC] ${selected ? 'bg-[#F0F7FF]' : ''}`}
                  onClick={() => onSelect?.(row)}
                >
                  <td className="px-4 py-4 sm:px-5">
                    <p
                      className="text-sm font-bold text-[#0F172A]"
                      style={{ fontFamily: ADMIN_AUDIT_FONT }}
                    >
                      {row.issueType}
                    </p>
                    <p
                      className="mt-1 text-xs font-medium text-[#94A3B8]"
                      style={{ fontFamily: ADMIN_AUDIT_FONT }}
                    >
                      {row.facilityName}
                    </p>
                  </td>
                  <td className="px-4 py-4 sm:px-5">
                    <span
                      className="text-sm font-medium text-[#0F172A]"
                      style={{ fontFamily: ADMIN_AUDIT_FONT }}
                    >
                      {classification.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 sm:px-5">
                    <span
                      className="text-sm font-medium text-[#0F172A]"
                      style={{ fontFamily: ADMIN_AUDIT_FONT }}
                    >
                      {priority.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 sm:px-5">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-bold"
                      style={{
                        fontFamily: ADMIN_AUDIT_FONT,
                        color: status.color,
                        background: status.bg,
                      }}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 sm:px-5">
                    <ChevronLeft size={18} className="text-[#2196F3]" strokeWidth={2.5} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-0 lg:hidden">
        {reports.map((row) => {
          const status = ADMIN_AUDIT_STATUS_LABELS[row.status]
          const priority = ADMIN_AUDIT_PRIORITY_LABELS[row.priority]
          const classification = ADMIN_AUDIT_CLASSIFICATION_LABELS[row.classification]
          const selected = selectedId === row.id

          return (
            <button
              key={row.id}
              type="button"
              onClick={() => onSelect?.(row)}
              className={`w-full border-b border-[#E8EEF5] p-4 text-right transition-colors last:border-b-0 ${selected ? 'bg-[#F0F7FF]' : 'bg-white'}`}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <ChevronLeft size={16} className="shrink-0 text-[#2196F3]" />
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-bold text-[#0F172A]"
                    style={{ fontFamily: ADMIN_AUDIT_FONT }}
                  >
                    {row.issueType}
                  </p>
                  <p
                    className="mt-1 text-xs font-medium text-[#94A3B8]"
                    style={{ fontFamily: ADMIN_AUDIT_FONT }}
                  >
                    {row.facilityName}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-start gap-3 text-xs sm:text-sm">
                <span
                  className="font-medium text-[#0F172A]"
                  style={{ fontFamily: ADMIN_AUDIT_FONT }}
                >
                  {classification.label}
                </span>
                <span
                  className="font-medium text-[#0F172A]"
                  style={{ fontFamily: ADMIN_AUDIT_FONT }}
                >
                  {priority.label}
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                  style={{
                    fontFamily: ADMIN_AUDIT_FONT,
                    color: status.color,
                    background: status.bg,
                  }}
                >
                  {status.label}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
