'use client'

import { useState } from 'react'
import { AlertTriangle, Clock, Info, Send } from 'lucide-react'
import type {
  LaunchAdminCommunicationBroadcastBody,
} from '@/schemas/adminCommunication'
import {
  ADMIN_COMMUNICATION_BENEFICIARY_OPTIONS,
  ADMIN_COMMUNICATION_GEOGRAPHIC_OPTIONS,
} from '@/lib/mocks/adminCommunicationMockData'
import {
  ADMIN_COMM_BLUE,
  ADMIN_COMM_CARD_SHADOW,
  ADMIN_COMM_CARD_SHELL,
  ADMIN_COMM_FONT,
  ADMIN_COMM_LABEL_STYLE,
} from '../adminCommunicationStyles'
import AdminCommunicationSelectField from '../AdminCommunicationSelectField'

interface AdminCommunicationBroadcastFormProps {
  saving?: boolean
  onSubmit: (body: LaunchAdminCommunicationBroadcastBody) => void | Promise<void>
}

const ALERT_CATEGORY_OPTIONS: {
  id: 'emergency' | 'service_update'
  label: string
  icon: typeof AlertTriangle
  bg: string
  color: string
}[] = [
  {
    id: 'emergency',
    label: 'عاجل طارئ',
    icon: AlertTriangle,
    bg: '#FEE2E2',
    color: '#EF4444',
  },
  {
    id: 'service_update',
    label: 'تحديث خدمي',
    icon: Info,
    bg: '#E8F5E9',
    color: '#22C55E',
  },
]

const BROADCAST_TIMING_OPTIONS: {
  id: 'immediate' | 'scheduled'
  label: string
  icon: typeof Send
  bg: string
  color: string
}[] = [
  {
    id: 'immediate',
    label: 'إرسال فوري',
    icon: Send,
    bg: '#E3F2FD',
    color: '#2196F3',
  },
  {
    id: 'scheduled',
    label: 'جدولة لاحقاً',
    icon: Clock,
    bg: '#FFF3E0',
    color: '#F97316',
  },
]

function AlertChip({
  label,
  icon: Icon,
  bg,
  color,
  selected,
  onClick,
}: {
  label: string
  icon: typeof AlertTriangle
  bg: string
  color: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-[11px] font-bold transition-all min-[420px]:gap-1.5 min-[420px]:px-2 min-[420px]:py-2.5 min-[420px]:text-xs sm:gap-2 sm:px-3 sm:py-3 sm:text-sm"
      style={{
        background: bg,
        color,
        outline: selected ? `2px solid ${color}` : '2px solid transparent',
      }}
    >
      <Icon size={14} strokeWidth={2.5} className="shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  )
}

const fieldClassName =
  'w-full rounded-xl border border-[#BBDEFB] bg-[#2196F31A] px-3 py-2.5 text-sm outline-none placeholder:text-[#64B5F6] focus:border-[#2196F3]'

export default function AdminCommunicationBroadcastForm({
  saving,
  onSubmit,
}: AdminCommunicationBroadcastFormProps) {
  const [alertCategory, setAlertCategory] = useState<'emergency' | 'service_update'>('emergency')
  const [broadcastTiming, setBroadcastTiming] = useState<'immediate' | 'scheduled'>('immediate')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [geographicScope, setGeographicScope] = useState('all')
  const [beneficiarySegment, setBeneficiarySegment] = useState('all')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    await onSubmit({
      alertType: broadcastTiming === 'immediate' ? alertCategory : 'scheduled',
      title: title.trim(),
      description: description.trim(),
      geographicScope,
      beneficiarySegment,
    })
    setTitle('')
    setDescription('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={ADMIN_COMM_CARD_SHELL}
      style={{ fontFamily: ADMIN_COMM_FONT, boxShadow: ADMIN_COMM_CARD_SHADOW }}
    >
      <h3 className="mb-5 text-right text-base font-bold text-[#0F172A] sm:text-lg">
        تجهيز بث جديد
      </h3>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        <div>
          <label className="mb-3 block text-right" style={ADMIN_COMM_LABEL_STYLE}>
            نوع التنبيه
          </label>
          <div className="grid grid-cols-2 gap-2 max-[380px]:grid-cols-1 sm:flex sm:gap-3">
            {ALERT_CATEGORY_OPTIONS.map((type) => (
              <AlertChip
                key={type.id}
                label={type.label}
                icon={type.icon}
                bg={type.bg}
                color={type.color}
                selected={alertCategory === type.id}
                onClick={() => setAlertCategory(type.id)}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="mb-3 block text-right" style={ADMIN_COMM_LABEL_STYLE}>
            توقيت البث
          </label>
          <div className="grid grid-cols-2 gap-2 max-[380px]:grid-cols-1 sm:flex sm:gap-3">
            {BROADCAST_TIMING_OPTIONS.map((type) => (
              <AlertChip
                key={type.id}
                label={type.label}
                icon={type.icon}
                bg={type.bg}
                color={type.color}
                selected={broadcastTiming === type.id}
                onClick={() => setBroadcastTiming(type.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-right" style={ADMIN_COMM_LABEL_STYLE}>
          عنوان البث الاستراتيجي
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ادخل عنواناً واضحاً ومميزاً"
          className={fieldClassName}
          style={{ fontFamily: ADMIN_COMM_FONT, color: '#0F172A' }}
        />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-right" style={ADMIN_COMM_LABEL_STYLE}>
          وصف المهمة التفصيلي<span className="text-[#EF4444]">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="اكتب تفاصيل الإشعار هنا..."
          rows={5}
          className={`${fieldClassName} resize-none`}
          style={{ fontFamily: ADMIN_COMM_FONT, color: '#0F172A' }}
        />
      </div>

      <div className="mb-6 rounded-xl border border-[#E8EEF5] bg-white p-3 sm:p-4">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="text-right" style={ADMIN_COMM_LABEL_STYLE}>
            تحديد الجمهور المستهدف
          </label>
          <button
            type="button"
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold sm:text-sm"
            style={{
              background: '#E3F2FD',
              color: ADMIN_COMM_BLUE,
              fontFamily: ADMIN_COMM_FONT,
            }}
          >
            تحديد ذكي
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <AdminCommunicationSelectField
            label="النطاق الجغرافي"
            value={geographicScope}
            onValueChange={setGeographicScope}
            options={ADMIN_COMMUNICATION_GEOGRAPHIC_OPTIONS}
          />
          <AdminCommunicationSelectField
            label="شريحة المستفيدين"
            value={beneficiarySegment}
            onValueChange={setBeneficiarySegment}
            options={ADMIN_COMMUNICATION_BENEFICIARY_OPTIONS}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving || !title.trim()}
        className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:text-base"
        style={{ background: ADMIN_COMM_BLUE, fontFamily: ADMIN_COMM_FONT }}
      >
        {saving ? 'جاري الإطلاق...' : 'اطلاق البث الجماعي'}
      </button>
    </form>
  )
}
