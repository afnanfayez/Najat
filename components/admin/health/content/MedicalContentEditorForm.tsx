'use client'

import { Bold, Italic, List, Paperclip } from 'lucide-react'
import { Input } from '@/components/ui/input'
import AdminUsersSelectField from '../../users/AdminUsersSelectField'
import ContentAttachmentUpload from './ContentAttachmentUpload'
import type { MedicalContentForm } from './types'
import {
  ADMIN_HEALTH_BLUE,
  ADMIN_HEALTH_FONT,
  ADMIN_HEALTH_INPUT_BG,
  ADMIN_HEALTH_LABEL_STYLE,
} from '../adminHealthStyles'
import { ADMIN_HEALTH_CONTENT_CATEGORIES } from '@/lib/mocks/adminHealthMockData'

const INPUT_CLASS =
  'h-11 w-full rounded-xl border-none pr-3 text-right text-sm shadow-none focus-visible:ring-0'

interface MedicalContentEditorFormProps {
  form: MedicalContentForm
  saving?: boolean
  onChange: <K extends keyof MedicalContentForm>(
    key: K,
    value: MedicalContentForm[K],
  ) => void
  onCancel: () => void
  onSave: () => void
}

export default function MedicalContentEditorForm({
  form,
  saving = false,
  onChange,
  onCancel,
  onSave,
}: MedicalContentEditorFormProps) {
  function applyFormat(prefix: string, suffix = prefix) {
    const textarea = document.getElementById(
      'medical-content-body',
    ) as HTMLTextAreaElement | null
    if (!textarea) return

    const { selectionStart, selectionEnd, value } = textarea
    const selected = value.slice(selectionStart, selectionEnd)
    const next =
      value.slice(0, selectionStart) +
      prefix +
      selected +
      suffix +
      value.slice(selectionEnd)

    onChange('body', next)
    window.requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(
        selectionStart + prefix.length,
        selectionEnd + prefix.length,
      )
    })
  }

  return (
    <section
      dir="rtl"
      className="rounded-2xl border border-[#E8EEF5] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-5 lg:p-6"
    >
      <h2
        className="mb-5 text-right text-base font-bold text-[#1E293B] sm:mb-6 sm:text-lg"
        style={{ fontFamily: ADMIN_HEALTH_FONT }}
      >
        محرر المحتوى
      </h2>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 text-right">
          <label style={ADMIN_HEALTH_LABEL_STYLE}>عنوان المقال</label>
          <Input
            value={form.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="أدخل عنوان المقال"
            className={INPUT_CLASS}
            style={{ fontFamily: ADMIN_HEALTH_FONT, background: ADMIN_HEALTH_INPUT_BG }}
          />
        </div>

        <AdminUsersSelectField
          label="التصنيف"
          value={form.category}
          onValueChange={(v) =>
            onChange('category', v as MedicalContentForm['category'])
          }
          options={ADMIN_HEALTH_CONTENT_CATEGORIES.map((c) => ({
            value: c.id,
            label: c.label,
          }))}
        />

        <AdminUsersSelectField
          label="حالة النشر"
          value={form.status}
          onValueChange={(v) =>
            onChange('status', v as MedicalContentForm['status'])
          }
          options={[
            { value: 'published', label: 'منشور' },
            { value: 'draft', label: 'مسودة' },
          ]}
        />

        <div className="flex flex-col gap-2 text-right">
          <label style={ADMIN_HEALTH_LABEL_STYLE}>المحتوى التعليمي</label>
          <div className="overflow-hidden rounded-xl border border-[#E8EEF5]">
            <div className="flex items-center gap-2 border-b border-[#E8EEF5] bg-[#F8FAFC] px-3 py-2">
              <button
                type="button"
                aria-label="عريض"
                onClick={() => applyFormat('**')}
                className="rounded-lg p-2 text-[#64748B] hover:bg-white hover:text-[#1E293B]"
              >
                <Bold size={16} />
              </button>
              <button
                type="button"
                aria-label="مائل"
                onClick={() => applyFormat('_')}
                className="rounded-lg p-2 text-[#64748B] hover:bg-white hover:text-[#1E293B]"
              >
                <Italic size={16} />
              </button>
              <button
                type="button"
                aria-label="قائمة"
                onClick={() => applyFormat('\n- ', '')}
                className="rounded-lg p-2 text-[#64748B] hover:bg-white hover:text-[#1E293B]"
              >
                <List size={16} />
              </button>
              <button
                type="button"
                aria-label="مرفق"
                onClick={() =>
                  document.getElementById('content-attachment-input')?.click()
                }
                className="rounded-lg p-2 text-[#64748B] hover:bg-white hover:text-[#1E293B]"
              >
                <Paperclip size={16} />
              </button>
            </div>
            <textarea
              id="medical-content-body"
              value={form.body}
              onChange={(e) => onChange('body', e.target.value)}
              placeholder="اكتب تفاصيل الحالة الميدانية هنا..."
              rows={8}
              className="min-h-[180px] w-full resize-y border-none bg-[#FAFBFC] px-4 py-3 text-right text-sm leading-7 text-[#334155] outline-none"
              style={{ fontFamily: ADMIN_HEALTH_FONT }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 text-right">
          <label style={ADMIN_HEALTH_LABEL_STYLE}>المراجع العلمية</label>
          <Input
            value={form.references}
            onChange={(e) => onChange('references', e.target.value)}
            placeholder="أضف روابط أو مصادر معتمدة"
            className={INPUT_CLASS}
            style={{ fontFamily: ADMIN_HEALTH_FONT, background: ADMIN_HEALTH_INPUT_BG }}
          />
        </div>

        <ContentAttachmentUpload
          attachments={form.attachments}
          onChange={(attachments) => onChange('attachments', attachments)}
        />
      </div>

      <div className="mt-6 flex w-full flex-row items-stretch gap-2 sm:items-center sm:justify-start sm:gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="min-w-0 flex-1 rounded-xl bg-[#F1F5F9] px-3 py-2.5 text-xs font-bold text-[#64748B] transition-opacity hover:opacity-80 disabled:opacity-60 sm:flex-none sm:px-6 sm:py-3 sm:text-sm"
          style={{ fontFamily: ADMIN_HEALTH_FONT }}
        >
          إلغاء
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:flex-none sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
          style={{ background: ADMIN_HEALTH_BLUE, fontFamily: ADMIN_HEALTH_FONT }}
        >
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>
    </section>
  )
}
