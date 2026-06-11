'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  ADMIN_USER_REGION_OPTIONS,
  ADMIN_USER_ROLE_OPTIONS,
} from '@/lib/mocks/adminUsersMockData'
import { useUpdateAdminUser } from '@/hooks/useAdminUsers'
import type { AdminManagedUser, AdminUserRole, AdminUserStatus } from '@/schemas/adminUser'
import {
  ADMIN_USERS_BLUE,
  ADMIN_USERS_FONT,
  ADMIN_USERS_INPUT_BG,
  ADMIN_USERS_LABEL_STYLE,
} from './adminUsersStyles'

interface AdminUserEditModalProps {
  user: AdminManagedUser | null
  open: boolean
  onClose: () => void
}

const STATUS_OPTIONS: { value: AdminUserStatus; label: string }[] = [
  { value: 'active', label: 'نشط' },
  { value: 'disabled', label: 'معطل' },
  { value: 'pending_review', label: 'قيد المراجعة' },
]

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === 'string') return message
  }
  return fallback
}

export default function AdminUserEditModal({ user, open, onClose }: AdminUserEditModalProps) {
  const updateUserMutation = useUpdateAdminUser()

  const [name, setName] = useState(() => user?.name ?? '')
  const [email, setEmail] = useState(() => user?.email ?? '')
  const [role, setRole] = useState<AdminUserRole>(() => user?.role ?? 'volunteer')
  const [region, setRegion] = useState(() => user?.region ?? '')
  const [status, setStatus] = useState<AdminUserStatus>(() => user?.status ?? 'active')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleOpenChange(next: boolean) {
    if (!next) onClose()
  }

  async function handleSave() {
    if (!user) return
    setSaving(true)
    setError(null)
    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        body: { name, email, role, region, status },
      })
      onClose()
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'حدث خطأ أثناء الحفظ'))
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'h-11 border-none pr-3 text-right text-sm shadow-none focus-visible:ring-2 focus-visible:ring-[#2196F3]/40'
  const selectClass =
    'h-11 w-full rounded-lg border-none px-3 text-right text-sm focus:outline-none focus:ring-2 focus:ring-[#2196F3]/40'
  const selectStyle = { background: ADMIN_USERS_INPUT_BG, fontFamily: ADMIN_USERS_FONT, color: '#334155' }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md"
        style={{ fontFamily: ADMIN_USERS_FONT, direction: 'rtl' }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: '#1e293b', fontFamily: ADMIN_USERS_FONT }}>
            تعديل بيانات المستخدم
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label style={ADMIN_USERS_LABEL_STYLE}>الاسم</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسم المستخدم"
              className={inputClass}
              style={{ background: ADMIN_USERS_INPUT_BG, fontFamily: ADMIN_USERS_FONT }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label style={ADMIN_USERS_LABEL_STYLE}>البريد الإلكتروني</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              type="email"
              className={inputClass}
              style={{
                background: ADMIN_USERS_INPUT_BG,
                fontFamily: ADMIN_USERS_FONT,
                direction: 'ltr',
                textAlign: 'right',
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label style={ADMIN_USERS_LABEL_STYLE}>الدور الوظيفي</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as AdminUserRole)}
              className={selectClass}
              style={selectStyle}
            >
              {ADMIN_USER_ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label style={ADMIN_USERS_LABEL_STYLE}>المنطقة</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className={selectClass}
              style={selectStyle}
            >
              {ADMIN_USER_REGION_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label style={ADMIN_USERS_LABEL_STYLE}>الحالة</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AdminUserStatus)}
              className={selectClass}
              style={selectStyle}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-[#F44336]" style={{ fontFamily: ADMIN_USERS_FONT }}>
              {error}
            </p>
          )}

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex h-11 flex-1 items-center justify-center rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: ADMIN_USERS_BLUE, fontFamily: ADMIN_USERS_FONT }}
            >
              {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex h-11 flex-1 items-center justify-center rounded-xl border border-[#E8EEF5] bg-white text-sm font-bold text-[#64748B] transition-colors hover:bg-[#F8FAFC] disabled:opacity-60"
              style={{ fontFamily: ADMIN_USERS_FONT }}
            >
              إلغاء
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
