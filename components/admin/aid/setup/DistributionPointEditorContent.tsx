'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import AdminShell from '../../AdminShell'
import DistributionPointEditorHeader from './DistributionPointEditorHeader'
import BasicInfoSection from './BasicInfoSection'
import StatusTypeSection from './StatusTypeSection'
import InventoryTableSection from './InventoryTableSection'
import ScheduleSection from './ScheduleSection'
import TargetGroupsSection from './TargetGroupsSection'
import DangerZoneSection from './DangerZoneSection'
import {
  createEmptyDistributionPoint,
  deleteAdminAidDistributionPoint,
  fetchAdminAidDistributionPointById,
  mapPointToForm,
  saveAdminAidDistributionPoint,
} from '../data/adminAidService'
import type { AdminAidDistributionPoint } from '@/schemas/adminAid'
import { SETUP_FONT } from './setupStyles'

function SetupRow({
  children,
  fullWidth = false,
}: {
  children: React.ReactNode
  fullWidth?: boolean
}) {
  return (
    <div
      className={`grid grid-cols-1 items-stretch gap-5 ${
        fullWidth ? 'grid-cols-1' : 'lg:grid-cols-12'
      }`}
    >
      {children}
    </div>
  )
}

function SetupCol({
  span = 8,
  children,
}: {
  span?: 8 | 4 | 12
  children: React.ReactNode
}) {
  const spanClass =
    span === 12
      ? 'lg:col-span-12'
      : span === 4
        ? 'lg:col-span-4'
        : 'lg:col-span-8'

  return <div className={`h-full min-h-0 ${spanClass}`}>{children}</div>
}

interface DistributionPointEditorContentProps {
  pointId?: string
}

export default function DistributionPointEditorContent({
  pointId,
}: DistributionPointEditorContentProps) {
  const router = useRouter()
  const isEdit = Boolean(pointId)
  const [form, setForm] = useState<AdminAidDistributionPoint>(
    createEmptyDistributionPoint(),
  )
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!pointId) return

    let cancelled = false

    async function loadPoint() {
      setLoading(true)
      try {
        const data = await fetchAdminAidDistributionPointById(pointId!)
        if (!data) {
          toast.error('نقطة التوزيع غير موجودة')
          router.push('/admin/aid')
          return
        }
        if (!cancelled) setForm(mapPointToForm(data))
      } catch {
        if (!cancelled) {
          toast.error('تعذّر تحميل بيانات نقطة التوزيع')
          router.push('/admin/aid')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadPoint()
    return () => {
      cancelled = true
    }
  }, [pointId, router])

  function updateField<K extends keyof AdminAidDistributionPoint>(
    key: K,
    value: AdminAidDistributionPoint[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error('يرجى إدخال اسم النقطة')
      return
    }

    setSaving(true)
    try {
      await saveAdminAidDistributionPoint(form)
      toast.success(isEdit ? 'تم تحديث نقطة التوزيع' : 'تم إنشاء نقطة التوزيع')
      router.push('/admin/aid')
    } catch {
      toast.error('تعذّر حفظ البيانات')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!pointId) return
    setDeleting(true)
    try {
      await deleteAdminAidDistributionPoint(pointId)
      toast.success('تم حذف نقطة التوزيع')
      router.push('/admin/aid')
    } catch {
      toast.error('تعذّر حذف نقطة التوزيع')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <AdminShell activeNav="aid">
        <div
          className="flex min-h-[40vh] items-center justify-center"
          style={{ fontFamily: SETUP_FONT }}
        >
          <p className="text-sm font-medium text-[#64748B]">جاري التحميل...</p>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell activeNav="aid">
      <DistributionPointEditorHeader
        isEdit={isEdit}
        onCancel={() => router.push('/admin/aid')}
        onSave={handleSave}
        saving={saving}
      />

      <div dir="rtl" className="flex flex-col gap-5">
        <SetupRow>
          <SetupCol span={8}>
            <BasicInfoSection form={form} onChange={updateField} />
          </SetupCol>
          <SetupCol span={4}>
            <StatusTypeSection form={form} onChange={updateField} />
          </SetupCol>
        </SetupRow>

        <SetupRow fullWidth>
          <SetupCol span={12}>
            <InventoryTableSection
              items={form.inventory}
              onChange={(inventory) => updateField('inventory', inventory)}
            />
          </SetupCol>
        </SetupRow>

        <SetupRow>
          <SetupCol span={8}>
            <ScheduleSection form={form} onChange={updateField} />
          </SetupCol>
          <SetupCol span={4}>
            <TargetGroupsSection form={form} onChange={updateField} />
          </SetupCol>
        </SetupRow>

        <DangerZoneSection
          onDelete={isEdit ? handleDelete : () => router.push('/admin/aid')}
          deleting={deleting}
        />
      </div>
    </AdminShell>
  )
}
