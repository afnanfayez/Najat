'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import AdminShell from '../AdminShell'
import AdminSecurityPageHeader from './AdminSecurityPageHeader'
import AdminSecurityTabs from './AdminSecurityTabs'
import AdminSecurityBackupView from './backup/AdminSecurityBackupView'
import AdminSecurityControlView from './control/AdminSecurityControlView'
import {
  createAdminSecurityBackup,
  fetchAdminSecurityDashboard,
  publishAdminSecurityBackup,
  saveAdminSecurityPermissions,
  updateAdminSecuritySchedule,
} from './data/adminSecurityService'
import type { AdminSecurityTab } from '@/schemas/adminSecurity'
import { ADMIN_SECURITY_FONT, ADMIN_SECURITY_PAGE, ADMIN_SECURITY_TAB_META } from './adminSecurityStyles'

export default function AdminSecurityContent() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<AdminSecurityTab>('security')
  const [showBackupConfirm, setShowBackupConfirm] = useState(false)
  const [dashboard, setDashboard] = useState<Awaited<
    ReturnType<typeof fetchAdminSecurityDashboard>
  > | null>(null)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAdminSecurityDashboard()
      setDashboard(data)
    } catch {
      toast.error('تعذّر تحميل بيانات الأمان')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const tabMeta = ADMIN_SECURITY_TAB_META[activeTab]

  async function handleUpdateSchedule(scheduleId: string, storageTargetIds: string[]) {
    try {
      await updateAdminSecuritySchedule(scheduleId, storageTargetIds)
      await loadDashboard()
      toast.success('تم تحديث الجدولة بنجاح', { position: 'top-center' })
    } catch {
      toast.error('تعذّر تحديث الجدولة')
    }
  }

  function handleNewBackup() {
    setShowBackupConfirm(true)
  }

  async function confirmNewBackup() {
    setShowBackupConfirm(false)
    try {
      const result = await createAdminSecurityBackup()
      await loadDashboard()
      const label = result?.filename ?? 'نسخة احتياطية'
      toast.success(`تم إنشاء: ${label}`, { position: 'top-center' })
    } catch {
      toast.error('تعذّر إنشاء النسخة الاحتياطية')
    }
  }

  async function handlePublish(backupId: string) {
    try {
      await publishAdminSecurityBackup(backupId)
      toast.success('تم نشر النسخة الاحتياطية', { position: 'top-center' })
    } catch {
      toast.error('تعذّر نشر النسخة')
    }
  }

  async function handleSavePermissions(roleId: string) {
    try {
      await saveAdminSecurityPermissions(roleId)
      toast.success('تم حفظ الأذونات', { position: 'top-center' })
    } catch {
      toast.error('تعذّر حفظ الأذونات')
    }
  }

  const headerAction = (
    <AdminSecurityTabs
      activeTab={activeTab}
      onTabChange={setActiveTab}
      className="hidden lg:flex lg:flex-wrap lg:overflow-visible"
    />
  )

  return (
    <>
      <Dialog open={showBackupConfirm} onOpenChange={setShowBackupConfirm}>
        <DialogContent dir="rtl" className="max-w-sm">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: ADMIN_SECURITY_FONT }}>
              تأكيد النسخ الاحتياطي
            </DialogTitle>
          </DialogHeader>
          <p
            className="mt-1 text-sm text-[#64748B]"
            style={{ fontFamily: ADMIN_SECURITY_FONT }}
          >
            هل أنت متأكد من إنشاء نسخة احتياطية جديدة الآن؟ سيتم حفظ حالة النظام الحالية.
          </p>
          <div className="mt-5 flex justify-start gap-3">
            <button
              onClick={confirmNewBackup}
              className="rounded-full bg-[#1565C0] px-5 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ fontFamily: ADMIN_SECURITY_FONT }}
            >
              تأكيد الإنشاء
            </button>
            <DialogClose asChild>
              <button
                className="rounded-full bg-[#F1F5F9] px-5 py-2 text-sm font-bold text-[#64748B] transition-opacity hover:opacity-80"
                style={{ fontFamily: ADMIN_SECURITY_FONT }}
              >
                إلغاء
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <AdminShell activeNav="security">
        <div className={ADMIN_SECURITY_PAGE}>
          <AdminSecurityPageHeader
            title={tabMeta.title}
            subtitle={tabMeta.subtitle}
            mobileTabs={
              <AdminSecurityTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                className="mb-4 lg:hidden"
              />
            }
            action={headerAction}
          />

          {loading ? (
            <div
              className="flex min-h-[40vh] items-center justify-center"
              style={{ fontFamily: ADMIN_SECURITY_FONT }}
            >
              <p className="text-sm font-medium text-[#64748B]">جاري التحميل...</p>
            </div>
          ) : dashboard && activeTab === 'backup' ? (
            <AdminSecurityBackupView
              dashboard={dashboard.backup}
              onNewBackup={handleNewBackup}
              onPublish={handlePublish}
              onUpdateSchedule={handleUpdateSchedule}
            />
          ) : dashboard && activeTab === 'security' ? (
            <AdminSecurityControlView
              dashboard={dashboard.security}
              onAddRole={() => toast.info('إضافة دور جديد — قريباً')}
              onSavePermissions={handleSavePermissions}
              onAdvancedPrivacy={() => toast.info('إعدادات الخصوصية — قريباً')}
              onBlockIp={() => toast.success('تم حظر عنوان IP')}
              onIgnoreAlert={() => toast.info('تم تجاهل التنبيه')}
              onViewAuditEntry={() => toast.info('تفاصيل السجل — قريباً')}
            />
          ) : null}
        </div>
      </AdminShell>
    </>
  )
}
