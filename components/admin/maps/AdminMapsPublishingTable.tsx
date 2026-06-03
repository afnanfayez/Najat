'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import AddRouteModal, { type RouteFormData } from './AddRouteModal'
import type { AdminMapsPublishLog, MapPublishStatus } from '@/schemas/adminMaps'
import {
  ADMIN_MAPS_BLUE,
  ADMIN_MAPS_CARD_SHADOW,
  ADMIN_MAPS_FONT,
} from './adminMapsStyles'

const STATUS_LABELS: Record<
  MapPublishStatus,
  { label: string; color: string; bg: string }
> = {
  published: { label: 'منشور', color: '#4CAF50', bg: '#E8F5E9' },
  processing: { label: 'قيد المعالجة', color: '#FF9800', bg: '#FFF3E0' },
  failed: { label: 'فشل الاتصال', color: '#EF4444', bg: '#FEE2E2' },
}

interface AdminMapsPublishingTableProps {
  logs: AdminMapsPublishLog[]
  onChange?: (logs: AdminMapsPublishLog[]) => void
}

function formatDevices(count: number | null): string {
  if (count == null) return '—'
  return count.toLocaleString('en-US')
}

function rowToFormValues(row: AdminMapsPublishLog): RouteFormData {
  return {
    areaName: row.geographicScope,
    classification: row.classification ?? 'safe',
    status: row.operationalStatus ?? 'maintenance',
    changeImpact: row.changeImpact ?? '',
  }
}

export default function AdminMapsPublishingTable({
  logs,
  onChange,
}: AdminMapsPublishingTableProps) {
  const [rows, setRows] = useState(logs)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [modalInitialValues, setModalInitialValues] = useState<
    Partial<RouteFormData> | undefined
  >()

  function updateRows(next: AdminMapsPublishLog[]) {
    setRows(next)
    onChange?.(next)
  }

  function openAddModal() {
    setEditingId(null)
    setModalInitialValues(undefined)
    setModalOpen(true)
  }

  function openEditModal(row: AdminMapsPublishLog) {
    setEditingId(row.id)
    setModalInitialValues(rowToFormValues(row))
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingId(null)
    setModalInitialValues(undefined)
  }

  function handleSaveRoute(data: RouteFormData) {
    if (editingId) {
      const next = rows.map((row) =>
        row.id === editingId
          ? {
              ...row,
              geographicScope: data.areaName,
              classification: data.classification,
              operationalStatus: data.status,
              changeImpact: data.changeImpact,
            }
          : row
      )
      updateRows(next)
      toast.success('تم تحديث المسار بنجاح', { position: 'top-center' })
      return
    }

    const newRow: AdminMapsPublishLog = {
      id: `log-${Date.now()}`,
      geographicScope: data.areaName,
      publishedAt: '24 مايو 2024 | 14:30',
      deviceCount: null,
      changeImpact: data.changeImpact,
      status: 'processing',
      classification: data.classification,
      operationalStatus: data.status,
    }
    updateRows([...rows, newRow])
    toast.success('تم اعتماد المسار وحفظه', { position: 'top-center' })
  }

  function handleDeleteRoute(row: AdminMapsPublishLog) {
    updateRows(rows.filter((item) => item.id !== row.id))
    toast.success(`تم حذف مسار «${row.geographicScope}»`, { position: 'top-center' })
  }

  return (
    <>
      <AddRouteModal
        open={modalOpen}
        onClose={closeModal}
        initialValues={modalInitialValues}
        onSave={handleSaveRoute}
      />

      <section dir="rtl" className="mb-6">
        <div
          className="overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white"
          style={{ boxShadow: ADMIN_MAPS_CARD_SHADOW }}
        >
          <div className="border-b border-[#E8EEF5] px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="text-right">
                <h2
                  className="text-base font-bold text-[#1E293B] sm:text-lg"
                  style={{ fontFamily: ADMIN_MAPS_FONT }}
                >
                  سجل عمليات النشر والانتشار
                </h2>
                <p
                  className="mt-1 text-xs font-medium text-[#64748B] sm:text-sm"
                  style={{ fontFamily: ADMIN_MAPS_FONT }}
                >
                  تتبع حالة وصول حزم الخرائط للمستخدمين في الميدان
                </p>
              </div>
              <button
                type="button"
                onClick={openAddModal}
                className="w-full shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 sm:w-auto sm:py-2"
                style={{ background: ADMIN_MAPS_BLUE, fontFamily: ADMIN_MAPS_FONT }}
              >
                + إضافة مسار جديد
              </button>
            </div>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] text-right">
              <thead>
                <tr className="border-b border-[#E8EEF5] bg-[#F8FAFC]">
                  {[
                    'النطاق الجغرافي',
                    'تاريخ النشر',
                    'عدد الأجهزة',
                    'تأثير التغيير',
                    'الحالة',
                    'إجراءات',
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-xs font-bold text-[#64748B]"
                      style={{ fontFamily: ADMIN_MAPS_FONT }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const status = STATUS_LABELS[row.status]
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-[#E8EEF5] last:border-b-0"
                    >
                      <td className="px-4 py-3">
                        <span
                          className="text-sm font-bold text-[#1E293B]"
                          style={{ fontFamily: ADMIN_MAPS_FONT }}
                        >
                          {row.geographicScope || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-sm text-[#64748B]"
                          style={{ fontFamily: ADMIN_MAPS_FONT }}
                        >
                          {row.publishedAt || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-sm font-bold text-[#1E293B]"
                          style={{ fontFamily: ADMIN_MAPS_FONT }}
                        >
                          {formatDevices(row.deviceCount)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-sm font-medium text-[#334155]"
                          style={{ fontFamily: ADMIN_MAPS_FONT }}
                        >
                          {row.changeImpact || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="rounded-full px-3 py-1 text-xs font-bold"
                          style={{
                            fontFamily: ADMIN_MAPS_FONT,
                            color: status.color,
                            background: status.bg,
                          }}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            aria-label="تعديل المسار"
                            onClick={() => openEditModal(row)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#E3F2FD] hover:text-[#2196F3]"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            aria-label="حذف المسار"
                            onClick={() => handleDeleteRoute(row)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#FEE2E2] hover:text-[#EF4444]"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 p-4 md:hidden">
            {rows.map((row) => {
              const status = STATUS_LABELS[row.status]
              return (
                <article
                  key={row.id}
                  className="rounded-2xl border border-[#E8EEF5] bg-[#FAFBFC] p-4"
                  dir="rtl"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold"
                      style={{
                        fontFamily: ADMIN_MAPS_FONT,
                        color: status.color,
                        background: status.bg,
                      }}
                    >
                      {status.label}
                    </span>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        aria-label="تعديل المسار"
                        onClick={() => openEditModal(row)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#E3F2FD] hover:text-[#2196F3]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        aria-label="حذف المسار"
                        onClick={() => handleDeleteRoute(row)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#FEE2E2] hover:text-[#EF4444]"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p
                    className="text-right text-base font-bold text-[#1E293B]"
                    style={{ fontFamily: ADMIN_MAPS_FONT }}
                  >
                    {row.geographicScope || '—'}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-right">
                    <div>
                      <p
                        className="text-xs font-medium text-[#94A3B8]"
                        style={{ fontFamily: ADMIN_MAPS_FONT }}
                      >
                        تاريخ النشر
                      </p>
                      <p
                        className="mt-1 text-sm text-[#64748B]"
                        style={{ fontFamily: ADMIN_MAPS_FONT }}
                      >
                        {row.publishedAt || '—'}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-xs font-medium text-[#94A3B8]"
                        style={{ fontFamily: ADMIN_MAPS_FONT }}
                      >
                        عدد الأجهزة
                      </p>
                      <p
                        className="mt-1 text-sm font-bold text-[#1E293B]"
                        style={{ fontFamily: ADMIN_MAPS_FONT }}
                      >
                        {formatDevices(row.deviceCount)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p
                        className="text-xs font-medium text-[#94A3B8]"
                        style={{ fontFamily: ADMIN_MAPS_FONT }}
                      >
                        تأثير التغيير
                      </p>
                      <p
                        className="mt-1 text-sm font-medium text-[#334155]"
                        style={{ fontFamily: ADMIN_MAPS_FONT }}
                      >
                        {row.changeImpact || '—'}
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
