'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, PackageCheck, ChevronDown, ChevronUp } from 'lucide-react'
import type { AidRequestDto } from '@/schemas/aidApi'
import { updateAdminAidRequestStatus } from './data/adminAidService'
import { ADMIN_AID_BLUE } from './adminAidStyles'

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'قيد المراجعة', color: '#F59E0B', bg: '#FEF3C7' },
  in_progress: { label: 'قيد التنفيذ', color: '#22C55E', bg: '#DCFCE7' },
  approved:  { label: 'مقبول',        color: '#22C55E', bg: '#DCFCE7' },
  rejected:  { label: 'مرفوض',        color: '#EF4444', bg: '#FEE2E2' },
  fulfilled: { label: 'مُنجز',        color: '#3B82F6', bg: '#DBEAFE' },
}

type RequestStatus = 'pending' | 'in_progress' | 'approved' | 'rejected' | 'fulfilled'

interface AdminAidRequestsTableProps {
  requests: AidRequestDto[]
  font?: string
  onRequestUpdated?: (updated: AidRequestDto) => void
}

function ActionButton({
  label,
  icon: Icon,
  color,
  bg,
  onClick,
  loading,
}: {
  label: string
  icon: React.ElementType
  color: string
  bg: string
  onClick: () => void
  loading: boolean
}) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      title={label}
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all hover:opacity-80 disabled:opacity-50"
      style={{ color, background: bg }}
    >
      <Icon size={13} strokeWidth={2.5} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

export default function AdminAidRequestsTable({
  requests: initialRequests,
  font = "'Cairo', sans-serif",
  onRequestUpdated,
}: AdminAidRequestsTableProps) {
  const [requests, setRequests] = useState<AidRequestDto[]>(initialRequests)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  async function handleStatusChange(req: AidRequestDto, newStatus: RequestStatus) {
    if (req.status === newStatus) return
    setLoadingId(req.id)
    try {
      const updated = await updateAdminAidRequestStatus(req.id, newStatus)
      const merged: AidRequestDto = { ...req, ...updated, status: newStatus }
      setRequests((prev) => prev.map((r) => (r.id === req.id ? merged : r)))
      onRequestUpdated?.(merged)
      const meta = STATUS_META[newStatus]
      toast.success(`تم تغيير الحالة إلى: ${meta?.label ?? newStatus}`, {
        position: 'top-center',
      })
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'تعذّر تحديث حالة الطلب'
      toast.error(message || 'تعذّر تحديث حالة الطلب')
    } finally {
      setLoadingId(null)
    }
  }

  if (requests.length === 0) {
    return (
      <div
        className="flex min-h-[20vh] items-center justify-center rounded-2xl border border-[#E8EEF5] bg-white"
        style={{ fontFamily: font }}
      >
        <p className="text-sm text-[#64748B]">لا توجد طلبات مساعدة حالياً</p>
      </div>
    )
  }

  return (
    <div
      className="overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
      dir="rtl"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b border-[#E8EEF5] px-5 py-4"
        style={{ fontFamily: font }}
      >
        <h2 className="text-base font-bold text-[#1E293B]">طلبات المساعدة</h2>
        <div className="flex gap-2 text-xs font-medium text-[#64748B]">
          <span>الإجمالي: {requests.length}</span>
          <span>·</span>
          <span className="text-[#F59E0B]">
            قيد المراجعة: {requests.filter((r) => r.status === 'pending').length}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse text-right"
          style={{ fontFamily: font, tableLayout: 'auto' }}
        >
          <thead>
            <tr style={{ background: `${ADMIN_AID_BLUE}12` }}>
              <th className="px-4 py-3.5 text-right text-[12px] font-semibold text-[#7E7D7D] whitespace-nowrap">
                رقم الطلب
              </th>
              <th className="px-3 py-3.5 text-right text-[12px] font-semibold text-[#7E7D7D] whitespace-nowrap">
                اسم الزوج
              </th>
              <th className="px-3 py-3.5 text-right text-[12px] font-semibold text-[#7E7D7D] whitespace-nowrap">
                اسم الزوجة
              </th>
              <th className="px-3 py-3.5 text-center text-[12px] font-semibold text-[#7E7D7D] whitespace-nowrap">
                رقم الهاتف
              </th>
              <th className="px-3 py-3.5 text-right text-[12px] font-semibold text-[#7E7D7D] whitespace-nowrap">
                الموقع
              </th>
              <th className="px-3 py-3.5 text-center text-[12px] font-semibold text-[#7E7D7D] whitespace-nowrap">
                الأبناء (ذ/إ)
              </th>
              <th className="px-3 py-3.5 text-center text-[12px] font-semibold text-[#7E7D7D] whitespace-nowrap">
                الحالة
              </th>
              <th className="px-3 py-3.5 text-center text-[12px] font-semibold text-[#7E7D7D] whitespace-nowrap">
                تاريخ الطلب
              </th>
              <th className="px-3 py-3.5 text-center text-[12px] font-semibold text-[#7E7D7D] whitespace-nowrap">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => {
              const statusMeta =
                STATUS_META[req.status] ?? {
                  label: req.status,
                  color: '#64748B',
                  bg: '#F1F5F9',
                }
              const isLoading = loadingId === req.id
              const isExpanded = expandedId === req.id
              const date = req.createdAt
                ? new Date(req.createdAt).toLocaleDateString('ar-EG', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '—'

              const r = req as AidRequestDto & {
                husbandName?: string
                wifeName?: string
                phoneNumber?: string
                currentLocation?: string
                aidOrganizationName?: string
                maleChildrenCount?: number
                femaleChildrenCount?: number
              }

              return (
                <React.Fragment key={req.id}>
                  <tr className="border-b border-[#EEF2F7] last:border-b-0 hover:bg-[#F8FAFC] transition-colors">
                    {/* ID + expand toggle */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : req.id)
                          }
                          className="flex h-5 w-5 items-center justify-center rounded text-[#94A3B8] transition-colors hover:text-[#475569]"
                        >
                          {isExpanded ? (
                            <ChevronUp size={13} />
                          ) : (
                            <ChevronDown size={13} />
                          )}
                        </button>
                        <span className="text-[11px] font-mono text-[#64748B]">
                          {req.id.slice(0, 8)}…
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3.5 text-[13px] font-medium text-[#1e293b]">
                      {r.husbandName || '—'}
                    </td>
                    <td className="px-3 py-3.5 text-[13px] font-medium text-[#1e293b]">
                      {r.wifeName || '—'}
                    </td>

                    <td
                      className="px-3 py-3.5 text-center text-[13px] text-[#475569] whitespace-nowrap"
                      dir="ltr"
                    >
                      {r.phoneNumber || '—'}
                    </td>

                    <td className="px-3 py-3.5 text-[13px] text-[#475569] max-w-[120px] truncate">
                      {r.currentLocation || '—'}
                    </td>

                    <td className="px-3 py-3.5 text-center text-[13px] text-[#475569] whitespace-nowrap">
                      {r.maleChildrenCount ?? 0} ذ / {r.femaleChildrenCount ?? 0} إ
                    </td>

                    {/* Status badge */}
                    <td className="px-3 py-3.5 text-center">
                      <span
                        className="rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap"
                        style={{
                          background: statusMeta.bg,
                          color: statusMeta.color,
                        }}
                      >
                        {statusMeta.label}
                      </span>
                    </td>

                    <td className="px-3 py-3.5 text-center text-[12px] text-[#64748B] whitespace-nowrap">
                      {date}
                    </td>

                    {/* Action buttons */}
                    <td className="px-3 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        {req.status !== 'in_progress' &&
                          req.status !== 'approved' &&
                          req.status !== 'fulfilled' && (
                            <ActionButton
                              label="قبول"
                              icon={CheckCircle2}
                              color="#16A34A"
                              bg="#DCFCE7"
                              onClick={() =>
                                handleStatusChange(req, 'in_progress')
                              }
                              loading={isLoading}
                            />
                          )}
                        {(req.status === 'in_progress' || req.status === 'approved') && (
                          <ActionButton
                            label="إنجاز"
                            icon={PackageCheck}
                            color="#2563EB"
                            bg="#DBEAFE"
                            onClick={() =>
                              handleStatusChange(req, 'fulfilled')
                            }
                            loading={isLoading}
                          />
                        )}
                        {req.status !== 'rejected' &&
                          req.status !== 'fulfilled' && (
                            <ActionButton
                              label="رفض"
                              icon={XCircle}
                              color="#DC2626"
                              bg="#FEE2E2"
                              onClick={() =>
                                handleStatusChange(req, 'rejected')
                              }
                              loading={isLoading}
                            />
                          )}
                        {(req.status === 'rejected' ||
                          req.status === 'fulfilled') && (
                          <ActionButton
                            label="إعادة"
                            icon={CheckCircle2}
                            color="#64748B"
                            bg="#F1F5F9"
                            onClick={() =>
                              handleStatusChange(req, 'pending')
                            }
                            loading={isLoading}
                          />
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded details row */}
                  {isExpanded && (
                    <tr className="bg-[#F8FAFC]">
                      <td colSpan={9} className="px-6 py-4">
                        <div
                          className="grid grid-cols-2 gap-3 text-right text-[12px] sm:grid-cols-3 lg:grid-cols-4"
                          style={{ fontFamily: font }}
                        >
                          <div>
                            <p className="font-semibold text-[#64748B]">
                              معرّف نقطة التوزيع
                            </p>
                            <p className="mt-0.5 font-mono text-[#1E293B]">
                              {req.aidPointId?.slice(0, 14) ?? '—'}
                            </p>
                          </div>
                          {r.aidOrganizationName && (
                            <div>
                              <p className="font-semibold text-[#64748B]">
                                المنظمة
                              </p>
                              <p className="mt-0.5 text-[#1E293B]">
                                {r.aidOrganizationName}
                              </p>
                            </div>
                          )}
                          {req.notes && (
                            <div className="col-span-2">
                              <p className="font-semibold text-[#64748B]">
                                ملاحظات
                              </p>
                              <p className="mt-0.5 text-[#1E293B]">
                                {req.notes}
                              </p>
                            </div>
                          )}
                          {req.requestedSupplies &&
                            req.requestedSupplies.length > 0 && (
                              <div className="col-span-2">
                                <p className="font-semibold text-[#64748B]">
                                  الإمدادات المطلوبة
                                </p>
                                <p className="mt-0.5 text-[#1E293B]">
                                  {req.requestedSupplies.join('، ')}
                                </p>
                              </div>
                            )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
