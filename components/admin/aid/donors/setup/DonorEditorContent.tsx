'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import AdminShell from '../../../AdminShell'
import DonorEditorHeader from './DonorEditorHeader'
import DonorBasicInfoSection from './DonorBasicInfoSection'
import DonorPartnershipSection from './DonorPartnershipSection'
import DonorNotesSection from './DonorNotesSection'
import DonorDonationsSection from './DonorDonationsSection'
import DonorDangerZoneSection from './DonorDangerZoneSection'
import {
  createEmptyDonor,
  deleteAdminAidDonor,
  fetchAdminAidDonations,
  fetchAdminAidDonorById,
  mapDonorToForm,
  saveAdminAidDonor,
} from '../../data/adminAidService'
import type { AdminAidDonationRecord, AdminAidDonorDetail } from '@/schemas/adminAid'
import { SETUP_FONT } from '../../setup/setupStyles'

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
        fullWidth ? 'grid-cols-1' : 'xl:grid-cols-12'
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
      ? 'xl:col-span-12'
      : span === 4
        ? 'xl:col-span-4'
        : 'xl:col-span-8'

  return <div className={`h-full min-h-0 ${spanClass}`}>{children}</div>
}

interface DonorEditorContentProps {
  donorId?: string
}

export default function DonorEditorContent({ donorId }: DonorEditorContentProps) {
  const router = useRouter()
  const isEdit = Boolean(donorId)
  const [form, setForm] = useState<AdminAidDonorDetail>(createEmptyDonor())
  const [donations, setDonations] = useState<AdminAidDonationRecord[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!donorId) return

    let cancelled = false

    async function loadDonor() {
      setLoading(true)
      try {
        const [donor, allDonations] = await Promise.all([
          fetchAdminAidDonorById(donorId!),
          fetchAdminAidDonations(),
        ])
        if (!donor) {
          toast.error('الجهة المانحة غير موجودة')
          router.push('/admin/aid?tab=donors')
          return
        }
        if (!cancelled) {
          setForm(mapDonorToForm(donor))
          setDonations(
            allDonations.filter((d) => d.donorName === donor.name),
          )
        }
      } catch {
        if (!cancelled) {
          toast.error('تعذّر تحميل بيانات المانح')
          router.push('/admin/aid?tab=donors')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDonor()
    return () => {
      cancelled = true
    }
  }, [donorId, router])

  function updateField<K extends keyof AdminAidDonorDetail>(
    key: K,
    value: AdminAidDonorDetail[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error('يرجى إدخال اسم الجهة المانحة')
      return
    }

    setSaving(true)
    try {
      const saved = await saveAdminAidDonor(form)
      const donationsWithName = donations.map((d) => ({
        ...d,
        donorName: saved.name,
      }))
      setDonations(donationsWithName)
      toast.success(isEdit ? 'تم تحديث بيانات المانح' : 'تم إضافة المانح بنجاح')
      router.push('/admin/aid?tab=donors')
    } catch {
      toast.error('تعذّر حفظ البيانات')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!donorId) return
    setDeleting(true)
    try {
      await deleteAdminAidDonor(donorId)
      toast.success('تم حذف الجهة المانحة')
      router.push('/admin/aid?tab=donors')
    } catch {
      toast.error('تعذّر حذف الجهة المانحة')
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
      <DonorEditorHeader
        isEdit={isEdit}
        onCancel={() => router.push('/admin/aid?tab=donors')}
        onSave={handleSave}
        saving={saving}
      />

      <div dir="rtl" className="flex flex-col gap-5">
        <SetupRow>
          <SetupCol span={8}>
            <DonorBasicInfoSection form={form} onChange={updateField} />
          </SetupCol>
          <SetupCol span={4}>
            <DonorPartnershipSection form={form} onChange={updateField} />
          </SetupCol>
        </SetupRow>

        <SetupRow fullWidth>
          <SetupCol span={12}>
            <DonorDonationsSection
              donations={donations.map((d) => ({
                ...d,
                donorName: form.name || d.donorName,
              }))}
              onChange={setDonations}
            />
          </SetupCol>
        </SetupRow>

        <SetupRow fullWidth>
          <SetupCol span={12}>
            <DonorNotesSection form={form} onChange={updateField} />
          </SetupCol>
        </SetupRow>

        {isEdit && (
          <DonorDangerZoneSection onDelete={handleDelete} deleting={deleting} />
        )}
      </div>
    </AdminShell>
  )
}
