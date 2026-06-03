'use client'

import { useRef, useState, useCallback } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import type { MedicalContentAttachment } from './types'
import { ADMIN_HEALTH_BLUE, ADMIN_HEALTH_FONT } from '../adminHealthStyles'

const MAX_BYTES = 50 * 1024 * 1024

interface ContentAttachmentUploadProps {
  attachments: MedicalContentAttachment[]
  onChange: (attachments: MedicalContentAttachment[]) => void
}

export default function ContentAttachmentUpload({
  attachments,
  onChange,
}: ContentAttachmentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const valid = Array.from(files).filter((file) => {
        if (file.size > MAX_BYTES) return false
        return (
          file.type.startsWith('image/') ||
          file.type === 'application/pdf' ||
          file.name.endsWith('.pdf')
        )
      })

      if (!valid.length) return

      const next = valid.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        url: URL.createObjectURL(file),
        file,
      }))

      onChange([...attachments, ...next].slice(0, 5))
    },
    [attachments, onChange],
  )

  function removeAttachment(id: string) {
    const target = attachments.find((a) => a.id === id)
    if (target?.url.startsWith('blob:')) URL.revokeObjectURL(target.url)
    onChange(attachments.filter((a) => a.id !== id))
  }

  return (
    <div className="flex flex-col gap-2 text-right">
      <input
        id="content-attachment-input"
        ref={inputRef}
        type="file"
        accept="image/*,.pdf,application/pdf"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {attachments.length > 0 && (
        <ul className="space-y-2">
          {attachments.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-[#F8FAFC] px-3 py-2"
            >
              <button
                type="button"
                aria-label="حذف الملف"
                onClick={() => removeAttachment(file.id)}
                className="text-[#94A3B8] hover:text-[#EF4444]"
              >
                <X size={16} />
              </button>
              <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
                <span
                  className="truncate text-sm font-medium text-[#334155]"
                  style={{ fontFamily: ADMIN_HEALTH_FONT }}
                >
                  {file.name}
                </span>
                <FileText size={16} className="shrink-0 text-[#64748B]" />
              </div>
            </li>
          ))}
        </ul>
      )}

      <label
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 transition-colors sm:gap-3 sm:px-6 sm:py-10 ${
          dragging
            ? 'border-[#2196F3] bg-[#E3F2FD66]'
            : 'border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#2196F3] hover:bg-[#E3F2FD33]'
        }`}
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: '#E3F2FD' }}
        >
          <Upload size={28} style={{ color: ADMIN_HEALTH_BLUE }} />
        </div>
        <div className="text-center">
          <p
            className="text-sm font-bold text-[#64748B]"
            style={{ fontFamily: ADMIN_HEALTH_FONT }}
          >
            اسحب وأفلت الصور أو المستندات هنا
          </p>
          <p
            className="mt-1 text-xs text-[#94A3B8]"
            style={{ fontFamily: ADMIN_HEALTH_FONT }}
          >
            الحد الأقصى 50 ميجابايت (JPG, PNG, PDF)
          </p>
        </div>
      </label>
    </div>
  )
}
