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
  const { profile, isLoading, isError, refetch, saveProfile, isSaving } =
    useProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [fullName, setFullName] = useState('')
  const [nationalId, setNationalId] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [region, setRegion] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>()
  const [pendingAvatar, setPendingAvatar] = useState<string | undefined>()
  const [cropSource, setCropSource] = useState<string | null>(null)
  const [cropOpen, setCropOpen] = useState(false)

  useEffect(() => {
    if (!profile) return
    setFullName(profile.fullName)
    setNationalId(profile.nationalId ?? '')
    setPhoneNumber(profile.phoneNumber ?? '')
    setRegion(profile.region ?? '')
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
        avatarDataUrl: pendingAvatar,
      })

      toast.success('تم حفظ التعديلات بنجاح')
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative">
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

      <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto mt-4 md:mt-0">
          <div className="flex flex-col w-full md:w-56">
            <label className="text-xs font-semibold text-blue-500 mb-1 px-1 text-center md:text-right">
              الاسم
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-center md:text-right font-bold text-slate-800 bg-white border border-blue-200 rounded-full py-2.5 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex flex-col w-full md:w-56">
            <label className="text-xs font-semibold text-blue-500 mb-1 px-1 text-center md:text-right">
              رقم الهوية
            </label>
            <input
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full text-center md:text-right font-bold text-slate-800 bg-white border border-blue-200 rounded-full py-2.5 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex flex-col w-full md:w-56">
            <label className="text-xs font-semibold text-blue-500 mb-1 px-1 text-center md:text-right">
              رقم الهاتف
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              dir="ltr"
              className="w-full text-center md:text-right font-bold text-slate-800 bg-white border border-blue-200 rounded-full py-2.5 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex flex-col w-full md:w-56">
            <label className="text-xs font-semibold text-blue-500 mb-1 px-1 text-center md:text-right">
              المنطقة
            </label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full text-center md:text-right font-bold text-slate-800 bg-white border border-blue-200 rounded-full py-2.5 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold py-3 px-8 rounded-lg shadow-sm transition-colors"
      >
        {isSaving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
      </button>
    </div>
  )
}
