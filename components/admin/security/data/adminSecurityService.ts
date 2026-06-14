import type {
  AdminSecurityDashboard,
  AdminSecurityUpdateScheduleBody,
} from '@/schemas/adminSecurity'

function emptySecurityDashboard(): AdminSecurityDashboard {
  return {
    backup: {
      kpis: [],
      storageWarning: '',
      syncRequestsTitle: 'النسخ الاحتياطية',
      syncRequestsSubtitle: 'لا توجد نسخ احتياطية',
      newBackupLabel: 'نسخة جديدة',
      backups: [],
      publishLabel: 'نشر',
      scheduleTitle: 'جدولة النسخ الاحتياطي',
      timelineTitle: 'الجدول الزمني',
      scheduleOptions: [],
      selectedScheduleId: '',
      storageTargetsTitle: 'وجهات التخزين',
      storageTargets: [],
      updateScheduleLabel: 'تحديث الجدولة',
    },
    security: {
      rolesTitle: 'الأدوار والصلاحيات',
      addRoleLabel: 'إضافة دور',
      roles: [],
      selectedRoleId: '',
      permissionsTitle: 'الصلاحيات',
      permissionsSubtitle: 'حدد دوراً لعرض الصلاحيات',
      authorizedBadge: 'مخوّل',
      permissions: [],
      savePermissionsLabel: 'حفظ الصلاحيات',
      encryptionTitle: 'بروتوكولات التشفير',
      encryptionProtocols: [],
      advancedPrivacyLabel: 'إعدادات الخصوصية المتقدمة',
      alertsTitle: 'تنبيهات الأمان',
      activeAlertsCount: 0,
      alerts: [],
      auditTitle: 'سجل المراجعة',
      auditEntries: [],
    },
  }
}

export async function fetchAdminSecurityDashboard(): Promise<AdminSecurityDashboard> {
  return emptySecurityDashboard()
}

export async function updateAdminSecuritySchedule(
  _body: AdminSecurityUpdateScheduleBody
): Promise<void> {
  throw { status: 501, message: 'جدولة النسخ الاحتياطي غير متاحة حالياً' }
}

export async function publishAdminSecurityBackup(_backupId: string): Promise<void> {
  throw { status: 501, message: 'نشر النسخ الاحتياطية غير متاح حالياً' }
}

export async function createAdminSecurityBackup(): Promise<void> {
  throw { status: 501, message: 'إنشاء نسخ احتياطية غير متاح حالياً' }
}

export async function saveAdminSecurityPermissions(_roleId: string): Promise<void> {
  throw { status: 501, message: 'حفظ الصلاحيات غير متاح حالياً' }
}
