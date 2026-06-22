'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import AdminShell from '../../AdminShell'
import AdminHealthPageHeader from '../AdminHealthPageHeader'
import MedicalContentEditorForm from './MedicalContentEditorForm'
import {
  createAdminHealthContent,
  fetchAdminHealthContentById,
  updateAdminHealthContent,
} from '../data/adminHealthService'
import {
  INITIAL_MEDICAL_CONTENT,
  type MedicalContentForm,
} from './types'
import { SETUP_FONT } from '../setup/setupStyles'
import type { AdminHealthContentCategory } from '@/schemas/adminHealth'

interface MedicalContentEditorContentProps {
  contentId?: string
  defaultCategory?: AdminHealthContentCategory
}

export default function MedicalContentEditorContent({
  contentId,
  defaultCategory = 'first-aid',
}: MedicalContentEditorContentProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const isEdit = Boolean(contentId)
  const [form, setForm] = useState<MedicalContentForm>({
    ...INITIAL_MEDICAL_CONTENT,
    category: defaultCategory,
  })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!contentId) return

    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const data = await fetchAdminHealthContentById(contentId!)
        if (!cancelled) setForm(data)
      } catch {
        if (!cancelled) {
          toast.error('تعذّر تحميل المحتوى')
          router.push('/admin/health?tab=content')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [contentId, router])

  function updateField<K extends keyof MedicalContentForm>(
    key: K,
    value: MedicalContentForm[K],
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'attachments') {
        const atts = value as any[]
        const imgAttach = atts.find((a) =>
          a.file ? a.file.type.startsWith('image/') : a.url.match(/\.(jpg|jpeg|png|gif|webp)/i)
        )
        if (imgAttach) {
          next.thumbnailUrl = imgAttach.url
        } else {
          next.thumbnailUrl = '/assets/artical.png'
        }
      }
      return next
    })
  }

  async function handleSave() {
    if (!form.title.trim()) {
      toast.error('يرجى إدخال عنوان المقال')
      return
    }
    if (!form.body.trim()) {
      toast.error('يرجى كتابة المحتوى التعليمي')
      return
    }

    setSaving(true)
    let saved = false
    try {
      if (isEdit && contentId) {
        await updateAdminHealthContent(contentId, form)
        toast.success('تم تحديث المحتوى بنجاح', { duration: 5000 })
      } else {
        await createAdminHealthContent(form)
        toast.success('تم إنشاء المحتوى بنجاح', { duration: 5000 })
      }
      saved = true
    } catch {
      toast.error('تعذّر حفظ المحتوى')
    } finally {
      setSaving(false)
    }

    if (saved) {
      const isOffline = typeof window !== 'undefined' && !navigator.onLine
      if (typeof window !== 'undefined' && navigator.onLine) {
        queryClient.invalidateQueries({ queryKey: ['admin-health-content'] }).catch(() => {})
        queryClient.invalidateQueries({ queryKey: ['health-guide'] }).catch(() => {})
      }
      if (isOffline) {
        setTimeout(() => {
          router.push('/admin/health?tab=content')
        }, 2500)
      } else {
        router.push('/admin/health?tab=content')
      }
    }
  }

  if (loading) {
    return (
      <AdminShell activeNav="health">
        <p
          className="py-20 text-center text-sm text-[#64748B]"
          style={{ fontFamily: SETUP_FONT }}
        >
          جاري تحميل المحتوى...
        </p>
      </AdminShell>
    )
  }

  return (
    <AdminShell activeNav="health">
      <AdminHealthPageHeader
        activeTab="content"
        onTabChange={(tab) => {
          router.push(tab === 'facilities' ? '/admin/health' : '/admin/health?tab=content')
        }}
        title="إدارة المحتوى الطبي"
        subtitle="مرحباً بك في لوحة نجاة، راجع وانشر المحتوى التعليمي"
      />

      <MedicalContentEditorForm
        form={form}
        saving={saving}
        onChange={updateField}
        onCancel={() => router.push('/admin/health?tab=content')}
        onSave={handleSave}
      />
    </AdminShell>
  )
}
