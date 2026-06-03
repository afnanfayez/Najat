'use client'

import { useEffect } from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'
import type { AdminHealthFacility } from '@/schemas/adminHealth'
import { ADMIN_HEALTH_FONT } from './adminHealthStyles'

interface DeleteFacilityDialogProps {
  facility: AdminHealthFacility | null
  open: boolean
  loading?: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
}

export default function DeleteFacilityDialog({
  facility,
  open,
  loading = false,
  onClose,
  onConfirm,
}: DeleteFacilityDialogProps) {
  useEffect(() => {
    if (!open) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !loading) onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, loading, onClose])

  if (!open || !facility) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-facility-title"
    >
      <button
        type="button"
        aria-label="إغلاق"
        disabled={loading}
        onClick={onClose}
        className="absolute inset-0 bg-[#0F172A]/55 backdrop-blur-[2px] transition-opacity"
      />

      <div
        className="delete-facility-dialog relative w-full max-w-[420px] overflow-hidden rounded-3xl bg-white shadow-[0_24px_64px_rgba(15,23,42,0.22)]"
        dir="rtl"
        style={{ fontFamily: ADMIN_HEALTH_FONT }}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-[#F44336] via-[#EF5350] to-[#FF8A80]" />

        <button
          type="button"
          aria-label="إغلاق"
          disabled={loading}
          onClick={onClose}
          className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F8FAFC] text-[#64748B] transition-colors hover:bg-[#EEF2F7] disabled:opacity-50"
        >
          <X size={18} />
        </button>

        <div className="px-6 pt-8 pb-6 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#FEE2E2] ring-8 ring-[#FEF2F2]">
            <Trash2 size={28} className="text-[#EF4444]" strokeWidth={2.2} />
          </div>

          <h2
            id="delete-facility-title"
            className="text-xl font-bold text-[#1E293B]"
          >
            تأكيد حذف المنشأة
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#64748B]">
            أنت على وشك حذف
          </p>

          <p className="mt-1 rounded-2xl bg-[#F8FAFC] px-4 py-3 text-base font-bold text-[#1E293B]">
            {facility.name}
          </p>

          <div className="mt-4 flex items-start justify-center gap-2 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-right">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-[#EF4444]"
            />
            <p className="text-xs leading-6 text-[#B91C1C]">
              سيتم حذف جميع بيانات المنشأة نهائياً ولا يمكن التراجع عن هذا
              الإجراء.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#EEF2F7] bg-[#FAFBFC] px-4 py-4 sm:flex-row sm:gap-3 sm:px-6">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="w-full rounded-xl border border-[#CBD5E1] bg-white py-3 text-sm font-bold text-[#475569] transition-colors hover:bg-[#F8FAFC] disabled:opacity-60 sm:flex-1"
          >
            إلغاء
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#EF4444] py-3 text-sm font-bold text-white transition-colors hover:bg-[#DC2626] disabled:cursor-not-allowed disabled:opacity-70 sm:flex-1"
          >
            <Trash2 size={16} />
            {loading ? 'جاري الحذف...' : 'حذف المنشأة'}
          </button>
        </div>
      </div>
    </div>
  )
}
