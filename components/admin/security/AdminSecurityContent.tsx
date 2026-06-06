'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
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
      await updateAdminSecuritySchedule({ scheduleId, storageTargetIds })
      await loadDashboard()
      toast.success('تم تحديث الجدولة بنجاح', { position: 'top-center' })
    } catch {
      toast.error('تعذّر تحديث الجدولة')
    }
  }

  async function handleNewBackup() {
    try {
      await createAdminSecurityBackup()
      await loadDashboard()
      toast.success('تم إنشاء نسخة احتياطية جديدة', { position: 'top-center' })
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
  )
}
