'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera } from 'lucide-react'
import { toast } from 'sonner'
import AvatarCropModal from '../shared/AvatarCropModal'
import ProfileAvatar from '../shared/ProfileAvatar'
import { useProfile } from '@/hooks/useProfile'
import { readAvatarFile } from '@/lib/profile/localProfileStorage'

export default function EditHeader() {
  const router = useRouter()
  const { profile, isLoading, isError, refetch, saveProfile, isSaving } = useProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [fullName, setFullName] = useState('')
  const [nationalId, setNationalId] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [region, setRegion] = useState('')
  
  // New fields from DTO
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [ageGroup, setAgeGroup] = useState<'18-40' | 'above 40' | ''>('')
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'married' | 'divorced' | 'widowed' | ''>('')
  const [healthStatus, setHealthStatus] = useState<'Healthy' | 'Chronically Ill' | 'Injured' | 'Amputee' | ''>('')
  const [housingStatus, setHousingStatus] = useState('')
  const [familyMembersCount, setFamilyMembersCount] = useState<number | ''>('')
  const [femalesCount, setFemalesCount] = useState<number | ''>('')
  const [malesCount, setMalesCount] = useState<number | ''>('')

  const [avatarPreview, setAvatarPreview] = useState<string | undefined>()
  const [pendingAvatar, setPendingAvatar] = useState<string | undefined>()
  const [cropSource, setCropSource] = useState<string | null>(null)
  const [cropOpen, setCropOpen] = useState(false)

  useEffect(() => {
    if (!profile) return
    setFullName(profile.fullName || '')
    setNationalId(profile.nationalId || '')
    setPhoneNumber(profile.phoneNumber || '')
    setRegion(profile.region || '')
    
    setGender((profile.gender as 'male' | 'female') || '')
    setAgeGroup((profile.ageGroup as '18-40' | 'above 40') || '')
    setMaritalStatus((profile.maritalStatus as any) || '')
    setHealthStatus((profile.healthStatus as any) || '')
    setHousingStatus(profile.housingStatus || '')
    setFamilyMembersCount(profile.familyMembersCount ?? '')
    setFemalesCount(profile.femalesCount ?? '')
    setMalesCount(profile.malesCount ?? '')

    setAvatarPreview(profile.avatarUrl ?? undefined)
    setPendingAvatar(undefined)
  }, [profile])

  const handlePickAvatar = () => fileInputRef.current?.click()

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await readAvatarFile(file)
      setCropSource(dataUrl)
      setCropOpen(true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'تعذّر تحميل الصورة')
    } finally {
      e.target.value = ''
    }
  }

  const handleSave = async () => {
    if (!profile) return

    try {
      await saveProfile({
        fullName: fullName.trim(),
        nationalId: nationalId.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
        region: region.trim() || undefined,
        gender: gender || undefined,
        ageGroup: ageGroup || undefined,
        maritalStatus: maritalStatus || undefined,
        healthStatus: healthStatus || undefined,
        housingStatus: housingStatus.trim() || undefined,
        familyMembersCount: familyMembersCount !== '' ? Number(familyMembersCount) : undefined,
        femalesCount: femalesCount !== '' ? Number(femalesCount) : undefined,
        malesCount: malesCount !== '' ? Number(malesCount) : undefined,
        avatarDataUrl: pendingAvatar,
      })

      if (navigator.onLine) {
        toast.success('تم حفظ التعديلات بنجاح')
      }
      setPendingAvatar(undefined)
      router.push('/profile')
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message ?? '')
          : ''
      toast.error(message || 'تعذّر حفظ التعديلات، حاول مرة أخرى')
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center text-slate-500 font-bold">
        جارٍ تحميل الملف الشخصي...
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center">
        <p className="text-slate-600 font-bold mb-4">تعذّر تحميل الملف الشخصي</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
        >
          إعادة المحاولة
        </button>
      </div>
    )
  }

  const handleCropConfirm = (croppedDataUrl: string) => {
    setAvatarPreview(croppedDataUrl)
    setPendingAvatar(croppedDataUrl)
    setCropSource(null)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col gap-6 relative">
      <AvatarCropModal
        open={cropOpen}
        imageSrc={cropSource}
        onOpenChange={(open) => {
          setCropOpen(open)
          if (!open) setCropSource(null)
        }}
        onConfirm={handleCropConfirm}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative shrink-0 z-10">
          <ProfileAvatar
            src={avatarPreview}
            size={128}
            borderClassName="border-4 border-white shadow-md"
          />
          <button
            type="button"
            onClick={handlePickAvatar}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-sm whitespace-nowrap transition-colors"
          >
            <Camera size={14} />
            تعديل
          </button>
        </div>

        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-blue-500 mb-1 px-1">الاسم</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full font-bold text-slate-800 bg-white border border-blue-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-blue-500 mb-1 px-1">رقم الهوية</label>
            <input type="text" value={nationalId} onChange={(e) => setNationalId(e.target.value)} className="w-full font-bold text-slate-800 bg-white border border-blue-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-blue-500 mb-1 px-1">رقم الهاتف</label>
            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} dir="ltr" className="w-full font-bold text-slate-800 bg-white border border-blue-200 rounded-lg py-2.5 px-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-blue-500 mb-1 px-1">المنطقة</label>
            <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} className="w-full font-bold text-slate-800 bg-white border border-blue-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-blue-500 mb-1 px-1">الجنس</label>
            <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="w-full font-bold text-slate-800 bg-white border border-blue-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="">اختر الجنس</option>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-blue-500 mb-1 px-1">الفئة العمرية</label>
            <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value as any)} className="w-full font-bold text-slate-800 bg-white border border-blue-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="">اختر الفئة</option>
              <option value="18-40">18-40</option>
              <option value="above 40">أكبر من 40</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-blue-500 mb-1 px-1">الحالة الاجتماعية</label>
            <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value as any)} className="w-full font-bold text-slate-800 bg-white border border-blue-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="">اختر الحالة</option>
              <option value="single">أعزب</option>
              <option value="married">متزوج</option>
              <option value="divorced">مطلق</option>
              <option value="widowed">أرمل</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-blue-500 mb-1 px-1">الحالة الصحية</label>
            <select value={healthStatus} onChange={(e) => setHealthStatus(e.target.value as any)} className="w-full font-bold text-slate-800 bg-white border border-blue-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="">اختر الحالة الصحية</option>
              <option value="Healthy">سليم</option>
              <option value="Chronically Ill">مريض مزمن</option>
              <option value="Injured">مصاب</option>
              <option value="Amputee">مبتور</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-blue-500 mb-1 px-1">حالة السكن</label>
            <input type="text" value={housingStatus} onChange={(e) => setHousingStatus(e.target.value)} className="w-full font-bold text-slate-800 bg-white border border-blue-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-blue-500 mb-1 px-1">عدد أفراد الأسرة</label>
            <input type="number" min="0" value={familyMembersCount} onChange={(e) => setFamilyMembersCount(e.target.value ? Number(e.target.value) : '')} className="w-full font-bold text-slate-800 bg-white border border-blue-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-blue-500 mb-1 px-1">عدد الإناث</label>
            <input type="number" min="0" value={femalesCount} onChange={(e) => setFemalesCount(e.target.value ? Number(e.target.value) : '')} className="w-full font-bold text-slate-800 bg-white border border-blue-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-blue-500 mb-1 px-1">عدد الذكور</label>
            <input type="number" min="0" value={malesCount} onChange={(e) => setMalesCount(e.target.value ? Number(e.target.value) : '')} className="w-full font-bold text-slate-800 bg-white border border-blue-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold py-3 px-10 rounded-lg shadow-sm transition-colors"
        >
          {isSaving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
        </button>
      </div>
    </div>
  )
}
