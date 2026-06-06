import type { AdminSecurityDashboard } from '@/schemas/adminSecurity'

export const ADMIN_SECURITY_TABS = [
  { id: 'security' as const, label: 'التحكم الأمني' },
  { id: 'backup' as const, label: 'النسخ الاحتياطي' },
]

export const ADMIN_SECURITY_DASHBOARD: AdminSecurityDashboard = {
  backup: {
    kpis: [
      { id: 'k1', label: 'سلامة التخزين', value: '94% ممتاز' },
      { id: 'k2', label: 'آخر نسخة ناجحة', value: 'منذ 3 ساعات' },
      { id: 'k3', label: 'حالة المزامنة', value: 'نشط وآمن' },
    ],
    storageWarning:
      'تحذير: مساحة التخزين السحابي شارفت على الانتهاء (متبقي 2.4 جيجابايت)',
    syncRequestsTitle: 'الطلبات المقبولة للمزامنة',
    syncRequestsSubtitle: 'تم التحقق من هذه البيانات وهي جاهزة للنشر العالمي',
    newBackupLabel: 'نسخة جديدة',
    publishLabel: 'نشر الآن',
    scheduleTitle: 'جدولة العمليات',
    timelineTitle: 'الجدول الزمني',
    scheduleOptions: [
      { id: 'daily', label: 'يومياً (03:00 ص)', sublabel: 'نسخ احتياطي تلقائي يومي' },
      { id: 'weekly', label: 'أسبوعياً (الجمعة)', sublabel: 'نسخة أسبوعية كاملة' },
      { id: 'monthly', label: 'شهرياً (يوم 1)', sublabel: 'أرشفة شهرية طويلة المدى' },
    ],
    selectedScheduleId: 'daily',
    storageTargetsTitle: 'أهداف التخزين',
    storageTargets: [
      { id: 'cloud', label: 'السحابة', icon: 'cloud', active: true },
      { id: 'server', label: 'السحابة', icon: 'server', active: true },
    ],
    updateScheduleLabel: 'تحديث الجدولة',
    backups: [
      {
        id: 'b1',
        version: 'v2.4.15',
        filename: 'backup_01-15',
        timestamp: '15 يناير 2025 • 03:00',
        size: '1.2 GB',
        integrityOk: true,
      },
      {
        id: 'b2',
        version: 'v2.4.14',
        filename: 'backup_01-14',
        timestamp: '14 يناير 2025 • 03:00',
        size: '1.1 GB',
        integrityOk: true,
      },
      {
        id: 'b3',
        version: 'v2.4.13',
        filename: 'backup_01-13',
        timestamp: '13 يناير 2025 • 03:00',
        size: '1.1 GB',
        integrityOk: true,
      },
    ],
  },
  security: {
    rolesTitle: 'تكوين الأدوار',
    addRoleLabel: 'إضافة دور جديد',
    roles: [
      { id: 'r1', name: 'مدير أول', description: 'وصول كامل للنظام' },
      { id: 'r2', name: 'منسق إقليمي', description: 'نطاق العمليات الميدانية' },
      { id: 'r3', name: 'مدقق حسابات', description: 'تحليلات للقراءة فقط' },
    ],
    selectedRoleId: 'r1',
    permissionsTitle: 'أذونات المدير الأول',
    permissionsSubtitle: 'إدارة الأذونات لوصول نجاة L4',
    authorizedBadge: 'مفوض',
    permissions: [
      { id: 'p1', label: 'تكوين النظام' },
      { id: 'p2', label: 'البيانات المالية' },
      { id: 'p3', label: 'إدارة المستخدمين' },
    ],
    savePermissionsLabel: 'حفظ الأذونات',
    encryptionTitle: 'بروتوكولات التشفير',
    encryptionProtocols: [
      {
        id: 'e1',
        name: 'قاعدة البيانات L1',
        sublabel: 'AES-256 متماثل',
        status: 'active',
        icon: 'lock',
      },
      {
        id: 'e2',
        name: 'خزنة الوسائط',
        sublabel: 'مشفر S3',
        status: 'active',
        icon: 'vault',
      },
      {
        id: 'e3',
        name: 'إخفاء البيانات الشخصية',
        sublabel: 'تنقيح على مستوى الحقل',
        status: 'inactive',
        icon: 'mask',
      },
    ],
    advancedPrivacyLabel: 'إعدادات الخصوصية المتقدمة',
    alertsTitle: 'استخبارات التنبيهات',
    activeAlertsCount: 2,
    alerts: [
      {
        id: 'a1',
        title: 'تم اكتشاف هجوم تخميني',
        description: 'محاولات فاشلة متكررة من 192.168.1.1',
        blockIpLabel: 'حظر IP',
        ignoreLabel: 'تجاهل',
      },
      {
        id: 'a2',
        title: 'تم اكتشاف هجوم تخميني',
        description: 'محاولات فاشلة متكررة من 192.168.1.1',
        blockIpLabel: 'حظر IP',
        ignoreLabel: 'تجاهل',
      },
    ],
    auditTitle: 'سجل التدقيق اللحظي',
    auditEntries: [
      {
        id: 'log1',
        timestamp: '2024-05-24 10:45:12',
        entity: 'احمد منصور',
        eventType: 'تسجيل_دخول_ناجح',
        status: 'تم التحقق',
        statusTone: 'verified',
      },
      {
        id: 'log2',
        timestamp: '2024-05-24 10:42:08',
        entity: 'سارة الخالد',
        eventType: 'تعديل_صلاحيات',
        status: 'تم التحقق',
        statusTone: 'verified',
      },
      {
        id: 'log3',
        timestamp: '2024-05-24 10:38:55',
        entity: 'نظام النسخ',
        eventType: 'نسخ_احتياطي_مكتمل',
        status: 'تم التحقق',
        statusTone: 'verified',
      },
    ],
  },
}
