'use client'

import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import RouteModalLocationBar from './RouteModalLocationBar'
import {
  ADMIN_MAPS_BLUE,
  ADMIN_MAPS_CARD_SHADOW,
  ADMIN_MAPS_FONT,
  ADMIN_MAPS_INPUT_BG,
} from './adminMapsStyles'

import type {
  MapRouteClassification,
  MapRouteOperationalStatus,
} from '@/schemas/adminMaps'

export type RouteClassification = MapRouteClassification
export type RouteOperationalStatus = MapRouteOperationalStatus

export interface RouteFormData {
  areaName: string
  classification: RouteClassification
  status: RouteOperationalStatus
  changeImpact: string
}

const DEFAULT_FORM: RouteFormData = {
  areaName: 'منطقة غزة المركزية',
  classification: 'safe',
  status: 'maintenance',
  changeImpact: '',
}

const CLASSIFICATION_OPTIONS: {
  id: RouteClassification
  label: string
  description: string
  icon: typeof CheckCircle2
  color: string
  selectedBg: string
}[] = [
  {
    id: 'safe',
    label: 'طريق آمن',
    description: 'سالك للمركبات الطبية الثقيلة والخفيفة',
    icon: CheckCircle2,
    color: '#22C55E',
    selectedBg: '#E3F2FD',
  },
  {
    id: 'danger',
    label: 'طريق خطر',
    description: 'اشتباكات نشطة أو وجود ألغام أرضية',
    icon: AlertTriangle,
    color: '#EF4444',
    selectedBg: '#FEF2F2',
  },
  {
    id: 'alternative',
    label: 'طريق بديل',
    description: 'طريق فرعي مخصص للحالات الاستثنائية',
    icon: ArrowUpDown,
    color: '#2196F3',
    selectedBg: '#E3F2FD',
  },
]

const STATUS_OPTIONS: { id: RouteOperationalStatus; label: string }[] = [
  { id: 'open', label: 'مفتوح' },
  { id: 'maintenance', label: 'صيانة' },
  { id: 'closed', label: 'مغلق' },
]

interface AddRouteModalProps {
  open: boolean
  onClose: () => void
  initialValues?: Partial<RouteFormData>
  onSave?: (data: RouteFormData) => void
}

export default function AddRouteModal({
  open,
  onClose,
  initialValues,
  onSave,
}: AddRouteModalProps) {
  const [areaName, setAreaName] = useState(DEFAULT_FORM.areaName)
  const [classification, setClassification] = useState<RouteClassification>(
    DEFAULT_FORM.classification
  )
  const [status, setStatus] = useState<RouteOperationalStatus>(DEFAULT_FORM.status)
  const [changeImpact, setChangeImpact] = useState(DEFAULT_FORM.changeImpact)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !saving) onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, saving, onClose])

  useEffect(() => {
    if (!open) {
      setSaving(false)
      return
    }

    setAreaName(initialValues?.areaName ?? DEFAULT_FORM.areaName)
    setClassification(initialValues?.classification ?? DEFAULT_FORM.classification)
    setStatus(initialValues?.status ?? DEFAULT_FORM.status)
    setChangeImpact(initialValues?.changeImpact ?? DEFAULT_FORM.changeImpact)
  }, [open, initialValues])

  if (!open) return null

  async function handleSave() {
    if (!areaName.trim()) {
      toast.error('يرجى إدخال اسم المنطقة')
      return
    }

    setSaving(true)
    try {
      onSave?.({ areaName: areaName.trim(), classification, status, changeImpact })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-route-title"
    >
      <button
        type="button"
        aria-label="إغلاق"
        disabled={saving}
        onClick={onClose}
        className="absolute inset-0 bg-[#64748B]/40 backdrop-blur-md"
      />

      <div
        className="relative flex max-h-[92vh] w-full max-w-[740px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_64px_rgba(15,23,42,0.28)]"
        dir="rtl"
        style={{ fontFamily: ADMIN_MAPS_FONT, boxShadow: ADMIN_MAPS_CARD_SHADOW }}
      >
        <button
          type="button"
          aria-label="إغلاق"
          onClick={onClose}
          disabled={saving}
          className="absolute top-4 left-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-[#64748B] transition-colors hover:bg-[#F1F5F9] disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <div className="shrink-0 border-b border-[#E8EEF5] px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
          <h2
            id="add-route-title"
            className="text-right text-lg font-bold text-[#0F172A] sm:text-xl"
          >
            إضافة / تعديل مسار
          </h2>
          <p className="mt-1 text-right text-xs font-medium text-[#64748B] sm:text-sm">
            إدارة وتحديث بيانات شبكة المساعدات الميدانية
          </p>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          <RouteModalLocationBar
            areaName={areaName}
            onAreaNameChange={setAreaName}
          />

          <div className="mb-5">
            <p className="mb-3 text-right text-sm font-bold text-[#0F172A]">تصنيف المسار</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {CLASSIFICATION_OPTIONS.map((opt) => {
                const Icon = opt.icon
                const selected = classification === opt.id
                const borderColor = selected
                  ? opt.id === 'safe'
                    ? ADMIN_MAPS_BLUE
                    : opt.color
                  : '#E8EEF5'

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setClassification(opt.id)}
                    className="rounded-2xl border-2 p-3 text-right transition-all sm:p-4"
                    style={{
                      background: selected ? opt.selectedBg : '#fff',
                      borderColor,
                    }}
                  >
                    <Icon
                      size={22}
                      className="mb-2"
                      style={{ color: opt.color }}
                      strokeWidth={2}
                    />
                    <p
                      className="text-sm font-bold"
                      style={{
                        color: selected && opt.id === 'safe' ? ADMIN_MAPS_BLUE : '#0F172A',
                      }}
                    >
                      {opt.label}
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-[#64748B] sm:text-xs">
                      {opt.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mb-5">
            <p className="mb-3 text-right text-sm font-bold text-[#0F172A]">
              حالة المسار الحالية
            </p>
            <div className="flex rounded-xl bg-[#F1F5F9] p-1">
              {STATUS_OPTIONS.map((opt) => {
                const selected = status === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStatus(opt.id)}
                    className="flex-1 rounded-lg py-2.5 text-xs font-bold transition-all sm:text-sm"
                    style={{
                      background: selected ? ADMIN_MAPS_BLUE : 'transparent',
                      color: selected ? '#fff' : '#64748B',
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mb-2">
            <p className="mb-3 text-right text-sm font-bold text-[#0F172A]">تأثير التغيير</p>
            <textarea
              value={changeImpact}
              onChange={(e) => setChangeImpact(e.target.value)}
              placeholder="أدخل وصف تأثير التغيير على المسار أو المنطقة..."
              rows={4}
              className="w-full resize-y rounded-2xl border-none px-4 py-3 text-right text-sm leading-7 text-[#334155] outline-none focus-visible:ring-2 focus-visible:ring-[#2196F3]/30"
              style={{ fontFamily: ADMIN_MAPS_FONT, background: ADMIN_MAPS_INPUT_BG }}
            />
          </div>
        </div>

        <div className="shrink-0 border-t border-[#E8EEF5] bg-[#FAFBFC] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-right text-[11px] font-medium text-[#94A3B8] sm:text-xs">
              يتم تدقيق هذه البيانات فورياً من قبل المركز الوطني اللوجستي
            </p>
            <div className="flex shrink-0 flex-row items-stretch gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="min-w-0 flex-1 rounded-xl px-4 py-2.5 text-xs font-bold transition-opacity hover:opacity-80 disabled:opacity-60 sm:flex-none sm:px-5 sm:py-3 sm:text-sm"
                style={{
                  fontFamily: ADMIN_MAPS_FONT,
                  background: `${ADMIN_MAPS_BLUE}1A`,
                  color: ADMIN_MAPS_BLUE,
                }}
              >
                تجاهل التغييرات
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="min-w-0 flex-1 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:flex-none sm:px-5 sm:py-3 sm:text-sm"
                style={{ background: ADMIN_MAPS_BLUE, fontFamily: ADMIN_MAPS_FONT }}
              >
                {saving ? 'جاري الحفظ...' : 'اعتماد وحفظ'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
