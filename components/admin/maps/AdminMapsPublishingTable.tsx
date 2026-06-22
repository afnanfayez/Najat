'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import AddRouteModal, { type RouteFormData } from './AddRouteModal'
import { useSafetyAdminMutations } from '@/hooks/useSafetyAdminMutations'
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
  published: { label: 'نشط', color: '#4CAF50', bg: '#E8F5E9' },
  processing: { label: 'قيد المعالجة', color: '#FF9800', bg: '#FFF3E0' },
  failed: { label: 'غير نشط', color: '#EF4444', bg: '#FEE2E2' },
}

interface AdminMapsPublishingTableProps {
  logs: AdminMapsPublishLog[]
}

function formatDevices(count: number | null): string {
  if (count == null) return '—'
  return count.toLocaleString('en-US')
}

function parseDangerLevel(impactText: string): 'low' | 'medium' | 'high' {
  const text = impactText.toLowerCase()
  if (text.includes('high') || text.includes('مرتفع') || text.includes('شديد') || text.includes('خطر كبير')) {
    return 'high'
  }
  if (text.includes('low') || text.includes('منخفض') || text.includes('بسيط')) {
    return 'low'
  }
  return 'medium'
}

function getStatusBadge(row: AdminMapsPublishLog) {
  const opStatus = row.operationalStatus ?? (row.status === 'failed' ? 'closed' : 'open')
  if (opStatus === 'maintenance') {
    return { label: 'صيانة', color: '#FF9800', bg: '#FFF3E0' }
  }
  if (opStatus === 'closed') {
    return { label: 'مغلق', color: '#EF4444', bg: '#FEE2E2' }
  }
  return { label: 'مفتوح', color: '#4CAF50', bg: '#E8F5E9' }
}

function rowToFormValues(row: AdminMapsPublishLog): Partial<RouteFormData> {
  return {
    areaName: row.geographicScope,
    classification: row.classification ?? 'safe',
    status: row.operationalStatus ?? 'open',
    changeImpact: row.changeImpact ?? '',
  }
}

export default function AdminMapsPublishingTable({
  logs,
}: AdminMapsPublishingTableProps) {
  const router = useRouter()
  const mutations = useSafetyAdminMutations()

  const [rows, setRows] = useState(logs)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<AdminMapsPublishLog | null>(null)
  const [modalInitialValues, setModalInitialValues] = useState<
    Partial<RouteFormData> | undefined
  >()

  // Stay in sync when parent re-fetches after mutations.
  useEffect(() => {
    setRows(logs)
  }, [logs])

  function openEditModal(row: AdminMapsPublishLog) {
    setEditingRow(row)
    setModalInitialValues(rowToFormValues(row))
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingRow(null)
    setModalInitialValues(undefined)
  }

  async function handleSaveRoute(data: RouteFormData) {
    if (!editingRow) return

    const oldClassification = editingRow.classification
    const newClassification = data.classification

    const resolvedName = data.status === 'maintenance'
      ? `${data.areaName} [MAINTENANCE]`
      : data.areaName

    const resolvedDangerLevel = parseDangerLevel(data.changeImpact)

    // Check if the user changed the classification of the route
    if (oldClassification && oldClassification !== newClassification) {
      if (oldClassification === 'danger') {
        if (newClassification === 'safe' && editingRow.positions?.length) {
          // Recreate danger zone as safe road
          await mutations.createSafeRoad.mutateAsync({
            name: resolvedName,
            description: data.changeImpact || '',
            path: {
              type: 'LineString',
              coordinates: editingRow.positions.map(([lat, lng]) => [lng, lat]),
            },
            isActive: data.status !== 'closed',
          })
          await mutations.deleteZone.mutateAsync(editingRow.id)
          toast.success('تم تحويل منطقة الخطر إلى مسار آمن بنجاح', { position: 'top-center' })
        } else if (newClassification === 'alternative' && editingRow.positions?.length) {
          // Recreate danger zone as resource point
          const [lat, lng] = editingRow.positions[0]
          await mutations.createResourcePoint.mutateAsync({
            name: resolvedName,
            type: 'medical',
            description: data.changeImpact || '',
            location: { type: 'Point', coordinates: [lng, lat] },
            isActive: data.status !== 'closed',
          })
          await mutations.deleteZone.mutateAsync(editingRow.id)
          toast.success('تم تحويل منطقة الخطر إلى نقطة موارد بنجاح', { position: 'top-center' })
        } else {
          toast.error('تعذر تحويل التصنيف لعدم توفر الإحداثيات اللازمة')
        }
      } else if (oldClassification === 'safe') {
        if (newClassification === 'danger' && editingRow.positions?.length) {
          // Recreate safe road as danger zone (close the line to form a polygon)
          const coords = [...editingRow.positions]
          if (coords.length > 0) {
            const first = coords[0]
            const last = coords[coords.length - 1]
            if (first[0] !== last[0] || first[1] !== last[1]) {
              coords.push(first)
            }
          }
          await mutations.createZone.mutateAsync({
            description: resolvedName,
            dangerLevel: resolvedDangerLevel,
            area: {
              type: 'Polygon',
              coordinates: [coords.map(([lat, lng]) => [lng, lat])],
            },
            isActive: data.status !== 'closed',
          })
          await mutations.deleteSafeRoad.mutateAsync(editingRow.id)
          toast.success('تم تحويل المسار الآمن إلى منطقة خطر بنجاح', { position: 'top-center' })
        } else if (newClassification === 'alternative' && editingRow.positions?.length) {
          // Recreate safe road as resource point
          const [lat, lng] = editingRow.positions[0]
          await mutations.createResourcePoint.mutateAsync({
            name: resolvedName,
            type: 'medical',
            description: data.changeImpact || '',
            location: { type: 'Point', coordinates: [lng, lat] },
            isActive: data.status !== 'closed',
          })
          await mutations.deleteSafeRoad.mutateAsync(editingRow.id)
          toast.success('تم تحويل المسار الآمن إلى نقطة موارد بنجاح', { position: 'top-center' })
        } else {
          toast.error('تعذر تحويل التصنيف لعدم توفر الإحداثيات اللازمة')
        }
      } else if (oldClassification === 'alternative') {
        if (newClassification === 'danger' && editingRow.position) {
          // Recreate resource point as danger zone (small square polygon)
          const [lat, lng] = editingRow.position
          const d = 0.0002
          const coords = [
            [lng - d, lat - d],
            [lng + d, lat - d],
            [lng + d, lat + d],
            [lng - d, lat + d],
            [lng - d, lat - d]
          ]
          await mutations.createZone.mutateAsync({
            description: resolvedName,
            dangerLevel: resolvedDangerLevel,
            area: {
              type: 'Polygon',
              coordinates: [coords],
            },
            isActive: data.status !== 'closed',
          })
          await mutations.deleteResourcePoint.mutateAsync(editingRow.id)
          toast.success('تم تحويل نقطة الموارد إلى منطقة خطر بنجاح', { position: 'top-center' })
        } else if (newClassification === 'safe' && editingRow.position) {
          // Recreate resource point as safe road (short line segment)
          const [lat, lng] = editingRow.position
          await mutations.createSafeRoad.mutateAsync({
            name: resolvedName,
            description: data.changeImpact || '',
            path: {
              type: 'LineString',
              coordinates: [[lng, lat], [lng + 0.0001, lat + 0.0001]],
            },
            isActive: data.status !== 'closed',
          })
          await mutations.deleteResourcePoint.mutateAsync(editingRow.id)
          toast.success('تم تحويل نقطة الموارد إلى مسار آمن بنجاح', { position: 'top-center' })
        } else {
          toast.error('تعذر تحويل التصنيف لعدم توفر الإحداثيات اللازمة')
        }
      }
    } else {
      // Normal update when classification remains unchanged
      if (newClassification === 'danger') {
        await mutations.updateZone.mutateAsync({
          id: editingRow.id,
          body: {
            description: resolvedName,
            dangerLevel: resolvedDangerLevel,
            isActive: data.status !== 'closed',
          },
        })
        toast.success('تم تحديث البيانات', { position: 'top-center' })
      } else if (newClassification === 'safe' && editingRow.positions?.length) {
        // Safe road update: delete and recreate with new fields
        await mutations.createSafeRoad.mutateAsync({
          name: resolvedName,
          description: data.changeImpact || '',
          path: {
            type: 'LineString',
            coordinates: editingRow.positions.map(([lat, lng]) => [lng, lat]),
          },
          isActive: data.status !== 'closed',
        })
        await mutations.deleteSafeRoad.mutateAsync(editingRow.id)
        toast.success('تم تحديث البيانات', { position: 'top-center' })
      } else if (newClassification === 'alternative' && editingRow.position) {
        // Resource point update: delete and recreate with new fields
        const [lat, lng] = editingRow.position
        await mutations.createResourcePoint.mutateAsync({
          name: resolvedName,
          type: 'medical',
          description: data.changeImpact || '',
          location: { type: 'Point', coordinates: [lng, lat] },
          isActive: data.status !== 'closed',
        })
        await mutations.deleteResourcePoint.mutateAsync(editingRow.id)
        toast.success('تم تحديث البيانات', { position: 'top-center' })
      } else {
        toast.info(
          'لتعديل إحداثيات المسار أو نقطة الموارد، استخدم محرر الخرائط',
          { duration: 5000 },
        )
        router.push('/admin/maps/new')
      }
    }

    closeModal()
  }

  async function handleDeleteRoute(row: AdminMapsPublishLog) {
    const classification = row.classification

    if (classification === 'danger') {
      await mutations.deleteZone.mutateAsync(row.id)
    } else if (classification === 'safe' || classification === 'alternative') {
      await mutations.deleteSafeRoad.mutateAsync(row.id)
    } else {
      await mutations.deleteResourcePoint.mutateAsync(row.id)
    }

    // Optimistic local removal so the table feels instant.
    setRows((prev) => prev.filter((r) => r.id !== row.id))
  }

  const isDeleting =
    mutations.deleteZone.isPending ||
    mutations.deleteSafeRoad.isPending ||
    mutations.deleteResourcePoint.isPending

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
                  عناصر الخريطة الأمنية
                </h2>
                <p
                  className="mt-1 text-xs font-medium text-[#64748B] sm:text-sm"
                  style={{ fontFamily: ADMIN_MAPS_FONT }}
                >
                  مناطق الخطر والمسارات الآمنة ونقاط الموارد المسجلة
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push('/admin/maps/new')}
                className="w-full shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 sm:w-auto sm:py-2"
                style={{ background: ADMIN_MAPS_BLUE, fontFamily: ADMIN_MAPS_FONT }}
              >
                + رسم عنصر جديد
              </button>
            </div>
          </div>

          {rows.length === 0 ? (
            <div
              className="flex min-h-30 items-center justify-center px-4 py-8"
              style={{ fontFamily: ADMIN_MAPS_FONT }}
            >
              <p className="text-sm font-medium text-[#94A3B8]">
                لا توجد عناصر مسجلة. استخدم محرر الخرائط لإضافة مناطق خطر أو مسارات آمنة.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-180 text-right">
                  <thead>
                    <tr className="border-b border-[#E8EEF5] bg-[#F8FAFC]">
                      {[
                        'الاسم / الوصف',
                        'النوع',
                        'التفاصيل',
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
                      const status = getStatusBadge(row)
                      const typeLabel =
                        row.classification === 'danger'
                          ? 'منطقة خطر'
                          : row.classification === 'safe'
                            ? 'مسار آمن'
                            : row.classification === 'alternative'
                              ? 'نقطة موارد'
                              : '—'
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
                              {typeLabel}
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
                                aria-label="تعديل"
                                onClick={() => openEditModal(row)}
                                disabled={isDeleting}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#E3F2FD] hover:text-[#2196F3] disabled:opacity-50"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                type="button"
                                aria-label="حذف"
                                onClick={() => handleDeleteRoute(row)}
                                disabled={isDeleting}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#FEE2E2] hover:text-[#EF4444] disabled:opacity-50"
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

              {/* Mobile cards */}
              <div className="flex flex-col gap-3 p-4 md:hidden">
                {rows.map((row) => {
                  const status = getStatusBadge(row)
                  const typeLabel =
                    row.classification === 'danger'
                      ? 'منطقة خطر'
                      : row.classification === 'safe'
                        ? 'مسار آمن'
                        : 'نقطة موارد'
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
                            aria-label="تعديل"
                            onClick={() => openEditModal(row)}
                            disabled={isDeleting}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#E3F2FD] hover:text-[#2196F3] disabled:opacity-50"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            aria-label="حذف"
                            onClick={() => handleDeleteRoute(row)}
                            disabled={isDeleting}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#FEE2E2] hover:text-[#EF4444] disabled:opacity-50"
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
                          <p className="text-xs font-medium text-[#94A3B8]" style={{ fontFamily: ADMIN_MAPS_FONT }}>
                            النوع
                          </p>
                          <p className="mt-1 text-sm text-[#64748B]" style={{ fontFamily: ADMIN_MAPS_FONT }}>
                            {typeLabel}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-[#94A3B8]" style={{ fontFamily: ADMIN_MAPS_FONT }}>
                            عدد الأجهزة
                          </p>
                          <p className="mt-1 text-sm font-bold text-[#1E293B]" style={{ fontFamily: ADMIN_MAPS_FONT }}>
                            {formatDevices(row.deviceCount)}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs font-medium text-[#94A3B8]" style={{ fontFamily: ADMIN_MAPS_FONT }}>
                            التفاصيل
                          </p>
                          <p className="mt-1 text-sm font-medium text-[#334155]" style={{ fontFamily: ADMIN_MAPS_FONT }}>
                            {row.changeImpact || '—'}
                          </p>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
