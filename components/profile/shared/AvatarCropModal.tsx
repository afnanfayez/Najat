'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Move } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AVATAR_CROP_VIEWPORT,
  clampCropOffset,
  computeCoverScale,
  cropAvatarToDataUrl,
  getInitialCropOffset,
} from '@/lib/profile/avatarCrop'

type AvatarCropModalProps = {
  open: boolean
  imageSrc: string | null
  onOpenChange: (open: boolean) => void
  onConfirm: (croppedDataUrl: string) => void
}

export default function AvatarCropModal({
  open,
  imageSrc,
  onOpenChange,
  onConfirm,
}: AvatarCropModalProps) {
  const viewport = AVATAR_CROP_VIEWPORT
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(
    null,
  )

  const resetCrop = useCallback(
    (width: number, height: number) => {
      const coverScale = computeCoverScale(width, height, viewport)
      const initial = getInitialCropOffset(width, height, coverScale, viewport)
      setScale(coverScale)
      setOffset({ x: initial.offsetX, y: initial.offsetY })
    },
    [viewport],
  )

  useEffect(() => {
    if (!open || !imageSrc) return

    setError(null)
    const img = new Image()
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height })
      resetCrop(img.width, img.height)
    }
    img.onerror = () => setError('تعذّر تحميل الصورة')
    img.src = imageSrc
  }, [open, imageSrc, resetCrop])

  const updateOffset = (nextX: number, nextY: number) => {
    if (!imageSize.width || !imageSize.height) return
    const clamped = clampCropOffset(
      nextX,
      nextY,
      imageSize.width,
      imageSize.height,
      scale,
      viewport,
    )
    setOffset({ x: clamped.offsetX, y: clamped.offsetY })
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!imageSrc || !imageSize.width) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return
    e.preventDefault()
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    updateOffset(dragRef.current.originX + dx, dragRef.current.originY + dy)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return
    dragRef.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const handleConfirm = async () => {
    if (!imageSrc || !imageSize.width) return
    setIsSaving(true)
    setError(null)
    try {
      const cropped = await cropAvatarToDataUrl(imageSrc, {
        offsetX: offset.x,
        offsetY: offset.y,
        scale,
      })
      onConfirm(cropped)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر قص الصورة')
    } finally {
      setIsSaving(false)
    }
  }

  const renderedWidth = imageSize.width * scale
  const renderedHeight = imageSize.height * scale

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md px-5 pb-5 pt-10">
        <DialogHeader>
          <DialogTitle className="text-right text-slate-800">
            ضبط صورة الملف الشخصي
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div
            className="relative touch-none cursor-grab active:cursor-grabbing overflow-hidden rounded-full border-4 border-blue-100 bg-slate-100 shadow-inner"
            style={{ width: viewport, height: viewport }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {imageSrc && imageSize.width > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt="معاينة القص"
                draggable={false}
                className="absolute max-w-none select-none pointer-events-none"
                style={{
                  width: renderedWidth,
                  height: renderedHeight,
                  left: offset.x,
                  top: offset.y,
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                جارٍ التحميل...
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/70 ring-inset" />
          </div>

          <div className="flex w-full items-center justify-center gap-2 text-xs text-slate-500">
            <Move size={14} />
            <span>اسحب لتحريك الصورة</span>
          </div>

          {error ? (
            <p className="w-full text-right text-sm text-red-500">{error}</p>
          ) : null}

          <div className="flex w-full gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 font-bold text-slate-600 transition-colors hover:bg-slate-50"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSaving || !imageSrc || !imageSize.width}
              className="flex-1 rounded-xl bg-blue-500 py-2.5 font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
            >
              {isSaving ? 'جارٍ المعالجة...' : 'استخدام الصورة'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
