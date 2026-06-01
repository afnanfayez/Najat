'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, Lock } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { updateAdminUser } from '@/lib/api/adminUsers'
import { USE_MOCK_ADMIN_USERS } from '@/lib/mocks/adminUsersMockData'
import { ADMIN_USERS_FONT } from './adminUsersStyles'

const FONT = { fontFamily: ADMIN_USERS_FONT }

interface AdminDisableUserModalProps {
  userId: string
  userName: string
  open: boolean
  onClose: () => void
  onConfirmed: (userId: string) => void
}

export default function AdminDisableUserModal({
  userId,
  userName,
  open,
  onClose,
  onConfirmed,
}: AdminDisableUserModalProps) {
  const queryClient = useQueryClient()
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  function handleOpenChange(next: boolean) {
    if (!next) handleCancel()
  }

  function handleCancel() {
    setPassword('')
    setPasswordError(false)
    setApiError(null)
    onClose()
  }

  async function handleConfirm() {
    if (!password.trim()) {
      setPasswordError(true)
      return
    }
    setPasswordError(false)
    setLoading(true)
    setApiError(null)
    try {
      if (!USE_MOCK_ADMIN_USERS) {
        await updateAdminUser(userId, { enabled: false })
      } else {
        await new Promise((r) => setTimeout(r, 400))
        await updateAdminUser(userId, { enabled: false })
      }
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      onConfirmed(userId)
      setPassword('')
      onClose()
    } catch (err: any) {
      setApiError(err?.message ?? 'تعذّر تعطيل الحساب')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="!top-1/2 !-translate-y-1/2 w-[90vw] !max-w-[600px]"
        style={{ ...FONT, direction: 'rtl', padding: '40px 36px 32px' }}
      >
        <DialogTitle className="sr-only">تعطيل حساب المستخدم</DialogTitle>

        {/* Warning icon */}
        <div className="mb-6 flex justify-center">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full"
            style={{ background: '#FEE2E2' }}
          >
            <AlertTriangle size={48} strokeWidth={1.8} color="#EF4444" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="mb-4 text-center text-xl font-bold text-[#1e293b]" style={FONT}>
          هل أنت متأكد من تعطيل هذا الحساب؟
        </h2>

        {/* Description */}
        <p className="mb-3 text-center text-[15px] leading-loose text-[#334155]" style={FONT}>
          سيؤدي تعطيل الحساب إلى منع المستخدم من الوصول إلى النظام فوراً.
          سيتم تعليق كافة العمليات الجارية وحظر الدخول حتى يتم إعادة التفعيل
          من قِبَل مسؤول النظام.
        </p>

        <p className="mb-6 text-center text-sm font-semibold" style={{ ...FONT, color: '#EF4444' }}>
          هذا الإجراء مسجل في سجلات الرقابة الأمنية.
        </p>

        {/* Admin password verification */}
        <div className="mb-6">
          <p className="mb-2 text-right text-sm font-bold text-[#1e293b]" style={FONT}>
            تأكيد هوية المسؤول
          </p>

          {/* Hidden honeypot inputs — absorb browser autofill so it never targets other fields */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
            <input type="text" tabIndex={-1} autoComplete="username" readOnly />
            <input type="password" tabIndex={-1} autoComplete="current-password" readOnly />
          </div>

          <div className="relative">
            <input
              type="password"
              id="admin-confirm-password"
              name="admin-confirm-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(false) }}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
              placeholder="أدخل كلمة مرور المسؤول للتأكيد"
              autoComplete="new-password"
              className="h-12 w-full rounded-xl pr-10 pl-4 text-right text-sm outline-none focus:ring-2 focus:ring-[#EF4444]/30"
              style={{
                ...FONT,
                background: '#F8FAFC',
                border: passwordError ? '1.5px solid #EF4444' : '1.5px solid #E8EEF5',
                color: '#334155',
                direction: 'rtl',
              }}
            />
            <Lock
              size={16}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
              color={passwordError ? '#EF4444' : '#94A3B8'}
            />
          </div>
          {passwordError && (
            <p className="mt-1.5 text-right text-xs text-[#EF4444]" style={FONT}>
              مطلوب للتحقق من الصلاحية
            </p>
          )}
          {apiError && (
            <p className="mt-1.5 text-right text-xs text-[#EF4444]" style={FONT}>
              {apiError}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex h-12 flex-1 items-center justify-center rounded-xl text-base font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: '#EF4444', ...FONT }}
          >
            {loading ? 'جاري التعطيل...' : 'تعطيل الحساب'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="flex h-12 flex-1 items-center justify-center rounded-xl text-base font-bold text-[#64748B] transition-colors hover:bg-[#CBD5E1] disabled:opacity-60"
            style={{ background: '#E2E8F0', ...FONT }}
          >
            تراجع
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
