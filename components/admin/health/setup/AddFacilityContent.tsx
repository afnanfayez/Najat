'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createAdminHealthFacility,
  fetchAdminHealthFacilityById,
  updateAdminHealthFacility,
} from '../data/adminHealthService'
import type { AdminHealthFacilityType } from '@/schemas/adminHealth'
import AdminShell from '../../AdminShell'
import AddFacilityHeader from './AddFacilityHeader'
import BasicInfoSection from './BasicInfoSection'
import OperatingStatusSection from './OperatingStatusSection'
import FacilityImageUpload from './FacilityImageUpload'
import FacilityServicesSection from './FacilityServicesSection'
import DrugInventorySection from './DrugInventorySection'
import MedicalStaffSection from './MedicalStaffSection'
import FacilityLocationMap from './FacilityLocationMap'
import WorkingDaysSection from './WorkingDaysSection'
import { reverseGeocodeLocation } from './geocode'
import { latToFormRegion } from '../data/facilitySetupMapper'
import {
  INITIAL_FACILITY_SETUP,
  type DrugStatus,
  type FacilityImage,
  type FacilitySetupForm,
} from './types'
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

interface AddFacilityContentProps {
  facilityId?: string
  facilityType?: AdminHealthFacilityType
}

export default function AddFacilityContent({ facilityId, facilityType }: AddFacilityContentProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const isEdit = Boolean(facilityId)
  const [form, setForm] = useState<FacilitySetupForm>(INITIAL_FACILITY_SETUP)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!facilityId) return

    let cancelled = false

    async function loadFacility() {
      setLoading(true)
      try {
        const data = await fetchAdminHealthFacilityById(facilityId!, facilityType)
        if (!cancelled) setForm(data)
      } catch {
        if (!cancelled) {
          toast.error('تعذّر تحميل بيانات المنشأة')
          router.push('/admin/health')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadFacility()
    return () => {
      cancelled = true
    }
  }, [facilityId, router])

  useEffect(() => {
    return () => {
      form.images.forEach((img) => {
        if (img.url.startsWith('blob:')) URL.revokeObjectURL(img.url)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function updateField<K extends keyof FacilitySetupForm>(
    key: K,
    value: FacilitySetupForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateImages(images: FacilityImage[]) {
    setForm((prev) => {
      prev.images
        .filter((img) => !images.some((n) => n.id === img.id))
        .forEach((img) => {
          if (img.url.startsWith('blob:')) URL.revokeObjectURL(img.url)
        })
      return { ...prev, images }
    })
  }

  function toggleService(id: string) {
    setForm((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(id)
        ? prev.selectedServices.filter((s) => s !== id)
        : [...prev.selectedServices, id],
    }))
  }

  function toggleDate(day: number) {
    setForm((prev) => ({
      ...prev,
      selectedDates: prev.selectedDates.includes(day)
        ? prev.selectedDates.filter((d) => d !== day)
        : [...prev.selectedDates, day],
    }))
  }

  function toggleTime(time: string) {
    setForm((prev) => ({
      ...prev,
      selectedTimes: prev.selectedTimes.includes(time)
        ? prev.selectedTimes.filter((t) => t !== time)
        : [...prev.selectedTimes, time],
    }))
  }

  function updateDrugStatus(id: string, status: DrugStatus) {
    setForm((prev) => ({
      ...prev,
      drugs: prev.drugs.map((d) => (d.id === id ? { ...d, status } : d)),
    }))
  }

  function addDrug(drug: Omit<FacilitySetupForm['drugs'][number], 'id'>) {
    setForm((prev) => ({
      ...prev,
      drugs: [...prev.drugs, { ...drug, id: `drug-${Date.now()}` }],
    }))
    toast.success('تمت إضافة الدواء')
  }

  function addStaff(member: Omit<FacilitySetupForm['staff'][number], 'id'>) {
    setForm((prev) => ({
      ...prev,
      staff: [...prev.staff, { ...member, id: `staff-${Date.now()}` }],
    }))
    toast.success('تمت إضافة الطبيب')
  }

  function removeStaff(id: string) {
    setForm((prev) => ({
      ...prev,
      staff: prev.staff.filter((s) => s.id !== id),
    }))
    toast.success('تم حذف الطبيب')
  }

  async function handleLocationChange(location: {
    latitude: number
    longitude: number
  }) {
    const address = await reverseGeocodeLocation(
      location.latitude,
      location.longitude,
    )

    setForm((prev) => ({
      ...prev,
      latitude: location.latitude,
      longitude: location.longitude,
      region: latToFormRegion(location.latitude),
      address: prev.address.trim() ? prev.address : (address ?? prev.address),
    }))
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error('يرجى إدخال اسم المنشأة')
      return
    }
    if (!form.address.trim()) {
      toast.error('يرجى إدخال العنوان')
      return
    }
    if (form.selectedTimes.length === 0) {
      toast.error('يرجى اختيار ساعة عمل واحدة على الأقل')
      return
    }
    if (form.selectedDates.length === 0) {
      toast.error('يرجى اختيار يوم عمل واحد على الأقل')
      return
    }
    if (form.latitude == null || form.longitude == null) {
      toast.error('يرجى تحديد الموقع الجغرافي على الخريطة')
      return
    }

    setSaving(true)
    try {
      if (isEdit && facilityId) {
        await updateAdminHealthFacility(facilityId, form, facilityType)
        toast.success('تم تحديث المنشأة بنجاح')
      } else {
        await createAdminHealthFacility(form, facilityType)
        toast.success('تم حفظ المنشأة بنجاح')
      }
      await queryClient.invalidateQueries({ queryKey: ['admin-health-facilities'] })
      router.push('/admin/health')
    } catch {
      toast.error(isEdit ? 'تعذّر تحديث المنشأة' : 'تعذّر حفظ المنشأة')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminShell activeNav="health">
        <p
          className="py-20 text-center text-sm text-[#64748B]"
          style={{ fontFamily: SETUP_FONT }}
        >
          جاري تحميل بيانات المنشأة...
        </p>
      </AdminShell>
    )
  }

  return (
    <AdminShell activeNav="health">
      <AddFacilityHeader
        title={isEdit ? 'تعديل المنشأة الصحية' : 'إعداد المنشأة الصحية'}
        subtitle={
          isEdit
            ? 'عدّل تفاصيل المركز الطبي واحفظ التغييرات'
            : 'أدخل تفاصيل المركز الطبي وتحديث حالات التوفر والخدمات'
        }
        onCancel={() => router.push('/admin/health')}
        onSave={handleSave}
        saving={saving}
      />

      <div dir="rtl" className="flex flex-col gap-5">
        <SetupRow>
          <SetupCol span={8}>
            <BasicInfoSection form={form} onChange={updateField} />
          </SetupCol>
          <SetupCol span={4}>
            <DrugInventorySection
              drugs={form.drugs}
              onAdd={addDrug}
              onStatusChange={updateDrugStatus}
            />
          </SetupCol>
        </SetupRow>

        <SetupRow>
          <SetupCol span={8}>
            <OperatingStatusSection
              value={form.operatingStatus}
              onChange={(v) => updateField('operatingStatus', v)}
            />
          </SetupCol>
          <SetupCol span={4}>
            <MedicalStaffSection
              staff={form.staff}
              onRemove={removeStaff}
              onAdd={addStaff}
            />
          </SetupCol>
        </SetupRow>

        <SetupRow>
          <SetupCol span={8}>
            <FacilityImageUpload images={form.images} onChange={updateImages} />
          </SetupCol>
          <SetupCol span={4}>
            <FacilityLocationMap
              latitude={form.latitude}
              longitude={form.longitude}
              onLocationChange={handleLocationChange}
            />
          </SetupCol>
        </SetupRow>

        <SetupRow fullWidth>
          <SetupCol span={12}>
            <FacilityServicesSection
              selected={form.selectedServices}
              onToggle={toggleService}
            />
          </SetupCol>
        </SetupRow>

        <SetupRow fullWidth>
          <SetupCol span={12}>
            <WorkingDaysSection
              selectedDates={form.selectedDates}
              selectedTimes={form.selectedTimes}
              onToggleDate={toggleDate}
              onToggleTime={toggleTime}
            />
          </SetupCol>
        </SetupRow>
      </div>
    </AdminShell>
  )
}
