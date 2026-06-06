'use client'

import { useRef, useState, type ReactNode } from 'react'
import {
  Calendar,
  Clock,
  FileImage,
  FileText,
  Info,
  Upload,
  UserCheck,
  X,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { AdminCommunicationTaskPriority } from '@/schemas/adminCommunication'
import {
  ADMIN_COMM_BLUE,
  ADMIN_COMM_FONT,
  ADMIN_COMM_INPUT_BG,
  ADMIN_COMM_LABEL_STYLE,
} from './adminCommunicationStyles'
import AdminCommunicationSelectField from './AdminCommunicationSelectField'
import { getAdminCommunicationVolunteers } from './data/adminCommunicationService'

interface MockAttachment {
  id: string
  name: string
  size: string
  type: 'image' | 'pdf'
}

interface AdminCommunicationAddTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  saving?: boolean
  onSubmit: (payload: {
    title: string
    description: string
    volunteerId: string
    priority: AdminCommunicationTaskPriority
    dueDate: string
    dueTime: string
  }) => void | Promise<void>
}

const PRIORITY_OPTIONS: {
  id: AdminCommunicationTaskPriority
  label: string
}[] = [
  { id: 'urgent', label: 'عاجل' },
  { id: 'normal', label: 'عادي' },
  { id: 'low', label: 'منخفض' },
]

const volunteerOptions = getAdminCommunicationVolunteers().map((v) => ({
  value: v.id,
  label: v.name,
}))

const fieldClassName =
  'w-full rounded-xl border border-[#BBDEFB] px-3 py-2.5 text-sm outline-none placeholder:text-[#64B5F6] focus:border-[#2196F3]'

function SectionHeader({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="mb-4 border-b border-[#E8EEF5] pb-3">
      <div className="flex items-center justify-start gap-2">
        {icon}
        <h3
          className="text-sm font-bold"
          style={{ fontFamily: ADMIN_COMM_FONT, color: ADMIN_COMM_BLUE }}
        >
          {title}
        </h3>
      </div>
    </div>
  )
}

export default function AdminCommunicationAddTaskModal({
  open,
  onOpenChange,
  saving = false,
  onSubmit,
}: AdminCommunicationAddTaskModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [volunteerId, setVolunteerId] = useState('')
  const [priority, setPriority] = useState<AdminCommunicationTaskPriority>('normal')
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [attachments, setAttachments] = useState<MockAttachment[]>([
    { id: 'a2', name: 'تقرير_الميدان.pdf', size: '2.4 MB', type: 'pdf' },
    { id: 'a1', name: 'خارطة_الموقع.jpg', size: '1.1 MB', type: 'image' },
  ])

  function resetForm() {
    setTitle('')
    setDescription('')
    setVolunteerId('')
    setPriority('normal')
    setDueDate('')
    setDueTime('')
    setAttachments([
      { id: 'a2', name: 'تقرير_الميدان.pdf', size: '2.4 MB', type: 'pdf' },
      { id: 'a1', name: 'خارطة_الموقع.jpg', size: '1.1 MB', type: 'image' },
    ])
  }

  async function handleSubmit() {
    if (!title.trim() || !description.trim() || !volunteerId) return
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      volunteerId,
      priority,
      dueDate,
      dueTime,
    })
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[92vh] max-w-2xl overflow-y-auto p-0 [&>button]:left-4 [&>button]:right-auto"
        dir="rtl"
      >
        <div className="px-5 py-4 sm:px-6">
          <DialogHeader className="text-right">
            <DialogTitle
              className="text-lg font-bold text-[#0F172A] sm:text-xl"
              style={{ fontFamily: ADMIN_COMM_FONT }}
            >
              إضافة مهمة جديدة
            </DialogTitle>
            <p
              className="text-sm font-medium text-[#0F172A]"
              style={{ fontFamily: ADMIN_COMM_FONT }}
            >
              أدخل تفاصيل المهمة وتعيينها للمتطوعين
            </p>
          </DialogHeader>
        </div>

        <div className="space-y-6 px-5 py-4 sm:px-6 sm:py-5">
          <section>
            <SectionHeader
              icon={<Info size={18} style={{ color: ADMIN_COMM_BLUE }} strokeWidth={2.5} />}
              title="المعلومات الأساسية"
            />
            <div className="space-y-3">
              <div>
                <label className="mb-2 block text-right" style={ADMIN_COMM_LABEL_STYLE}>
                  عنوان المهمة <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثلاً: توصيل المساعدات الطبية لمركز حي الأمل"
                  className={`text-right font-medium text-[#0F172A] ${fieldClassName}`}
                  style={{ fontFamily: ADMIN_COMM_FONT, background: ADMIN_COMM_INPUT_BG }}
                />
              </div>
              <div>
                <label className="mb-2 block text-right" style={ADMIN_COMM_LABEL_STYLE}>
                  وصف المهمة التفصيلي <span className="text-[#EF4444]">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب المهمة و التفاصيل بدقة هنا..."
                  rows={4}
                  className={`resize-y text-right font-medium text-[#0F172A] ${fieldClassName}`}
                  style={{ fontFamily: ADMIN_COMM_FONT, background: ADMIN_COMM_INPUT_BG }}
                />
              </div>
            </div>
          </section>

          <section>
            <SectionHeader
              icon={<UserCheck size={18} style={{ color: ADMIN_COMM_BLUE }} strokeWidth={2.5} />}
              title="تعيين المسؤولية"
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <AdminCommunicationSelectField
                label="المتطوع المسؤول"
                value={volunteerId || 'placeholder'}
                onValueChange={(v) => setVolunteerId(v === 'placeholder' ? '' : v)}
                options={[
                  { value: 'placeholder', label: 'اختر متطوعاً...' },
                  ...volunteerOptions,
                ]}
              />
              <div>
                <label
                  className="mb-2 block text-center md:text-right"
                  style={ADMIN_COMM_LABEL_STYLE}
                >
                  مستوى الأولوية
                </label>
                <div
                  className="flex items-center justify-between rounded-xl px-1 py-1"
                  style={{ background: ADMIN_COMM_INPUT_BG }}
                >
                  {PRIORITY_OPTIONS.map((opt) => {
                    const selected = priority === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPriority(opt.id)}
                        className="flex-1 rounded-full py-2 text-xs font-bold transition-all sm:text-sm"
                        style={{
                          fontFamily: ADMIN_COMM_FONT,
                          background: selected ? ADMIN_COMM_BLUE : 'transparent',
                          color: selected ? '#fff' : ADMIN_COMM_BLUE,
                        }}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          <section>
            <SectionHeader
              icon={<Calendar size={18} style={{ color: ADMIN_COMM_BLUE }} strokeWidth={2.5} />}
              title="الجدول الزمني والمرفقات"
            />
            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-right" style={ADMIN_COMM_LABEL_STYLE}>
                  تاريخ الاستحقاق
                </label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="MM/DD/YYYY"
                  className={`text-right font-medium ${fieldClassName}`}
                  style={{
                    fontFamily: ADMIN_COMM_FONT,
                    background: ADMIN_COMM_INPUT_BG,
                    color: dueDate ? '#0F172A' : '#64B5F6',
                  }}
                />
              </div>
              <div>
                <label className="mb-2 block text-right" style={ADMIN_COMM_LABEL_STYLE}>
                  الوقت المحدد
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    placeholder="--:--"
                    className={`pl-10 text-right font-medium ${fieldClassName}`}
                    style={{
                      fontFamily: ADMIN_COMM_FONT,
                      background: ADMIN_COMM_INPUT_BG,
                      color: dueTime ? '#0F172A' : '#64B5F6',
                    }}
                  />
                  <Clock
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#64B5F6]"
                  />
                </div>
              </div>
            </div>

            <label className="mb-2 block text-right" style={ADMIN_COMM_LABEL_STYLE}>
              المرفقات والوثائق
            </label>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              onChange={() => {
                /* mock only */
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mb-3 flex min-h-[100px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#CBD5E1] bg-[#FAFBFC] px-4 py-5 text-center"
            >
              <Upload size={26} className="mb-2 text-[#94A3B8]" strokeWidth={2} />
              <p
                className="text-sm font-bold text-[#64748B]"
                style={{ fontFamily: ADMIN_COMM_FONT }}
              >
                اسحب وأفلت الصور أو الوثائق هنا
              </p>
              <p
                className="mt-1 text-xs font-medium text-[#94A3B8]"
                style={{ fontFamily: ADMIN_COMM_FONT }}
              >
                الحد الأقصى 50 ميجابايت (JPG, PNG, PDF)
              </p>
            </button>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {attachments.map((file) => {
                const FileIcon = file.type === 'pdf' ? FileText : FileImage
                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-2.5"
                    dir="rtl"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7]">
                      <FileIcon size={16} className="text-[#22C55E]" strokeWidth={2.5} />
                    </span>
                    <div className="min-w-0 flex-1 text-right">
                      <p
                        className="truncate text-xs font-bold text-[#166534] sm:text-sm"
                        style={{ fontFamily: ADMIN_COMM_FONT }}
                      >
                        {file.name}
                      </p>
                      <p
                        className="text-[10px] font-medium text-[#22C55E] sm:text-xs"
                        style={{ fontFamily: ADMIN_COMM_FONT }}
                      >
                        تم الرفع بنجاح • {file.size}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="حذف"
                      onClick={() =>
                        setAttachments((prev) => prev.filter((a) => a.id !== file.id))
                      }
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#22C55E] hover:bg-white/60"
                    >
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        <div
          className="flex flex-col-reverse gap-2 border-t border-[#E8EEF5] px-5 py-4 sm:flex-row sm:justify-between sm:px-6"
          dir="rtl"
        >
          <button
            type="button"
            disabled={saving}
            onClick={() => onOpenChange(false)}
            className="rounded-xl border border-[#E2E8F0] bg-white px-6 py-2.5 text-sm font-bold text-[#0F172A]"
            style={{ fontFamily: ADMIN_COMM_FONT }}
          >
            إلغاء
          </button>
          <button
            type="button"
            disabled={saving || !title.trim() || !description.trim() || !volunteerId}
            onClick={handleSubmit}
            className="rounded-xl px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            style={{ background: ADMIN_COMM_BLUE, fontFamily: ADMIN_COMM_FONT }}
          >
            {saving ? 'جاري التعيين...' : 'تعيين المهمة الآن'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
