'use client'

import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import SetupSectionCard from './SetupSectionCard'
import type { FacilityImage } from './types'
import { SETUP_BLUE, SETUP_FONT } from './setupStyles'

interface FacilityImageUploadProps {
  images: FacilityImage[]
  onChange: (images: FacilityImage[]) => void
  className?: string
}

export default function FacilityImageUpload({
  images,
  onChange,
  className = '',
}: FacilityImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) =>
        f.type.startsWith('image/'),
      )
      if (!imageFiles.length) return

      const next = imageFiles.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        url: URL.createObjectURL(file),
        name: file.name,
        file,
      }))
      const combined = [...images, ...next].slice(0, 5)
      onChange(combined)
    },
    [images, onChange],
  )

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) addFiles(e.target.files)
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
  }

  function removeImage(id: string) {
    const target = images.find((img) => img.id === id)
    if (target) URL.revokeObjectURL(target.url)
    onChange(images.filter((img) => img.id !== id))
  }

  return (
    <SetupSectionCard title="صورة المنشأة الصحية" className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleInputChange}
      />

      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#E8EEF5]"
            >
              <Image
                src={img.url}
                alt={img.name}
                fill
                className="object-cover"
                sizes="200px"
                unoptimized
              />
              <button
                type="button"
                aria-label="حذف الصورة"
                onClick={() => removeImage(img.id)}
                className="absolute top-2 left-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <label
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 transition-colors sm:gap-3 sm:px-6 sm:py-8 ${
          dragging
            ? 'border-[#2196F3] bg-[#E3F2FD66]'
            : 'border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#2196F3] hover:bg-[#E3F2FD33]'
        }`}
        dir="rtl"
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: '#E3F2FD' }}
        >
          <Upload size={28} style={{ color: SETUP_BLUE }} />
        </div>
        <div className="text-center">
          <p
            className="text-sm font-bold text-[#64748B]"
            style={{ fontFamily: SETUP_FONT }}
          >
            اسحب وأفلت الصور أو انقر للاختيار
          </p>
          <p
            className="mt-1 text-xs text-[#94A3B8]"
            style={{ fontFamily: SETUP_FONT }}
          >
            PNG, JPG — حتى 5 صور
          </p>
        </div>
      </label>
    </SetupSectionCard>
  )
}
