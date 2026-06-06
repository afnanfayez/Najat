export type AdminIconKey =
  | 'users'
  | 'userPlus'
  | 'checkCircle'
  | 'alertTriangle'
  | 'pencil'
  | 'fileText'
  | 'barChart'
  | 'settings'

export type AdminAlertSeverity = 'critical' | 'warning'

export type AdminStatMock = {
  id: string
  title: string
  value: string
  icon: AdminIconKey
  valueColor?: string
}

export type AdminActivityMock = {
  id: string
  title: string
  time: string
  icon: AdminIconKey
}

export type AdminQuickActionMock = {
  id: string
  label: string
  icon: AdminIconKey
  href: string
}

export type AdminUrgentAlertMock = {
  id: string
  title: string
  description: string
  time: string
  severity: AdminAlertSeverity
}

export type AdminDashboardMockData = {
  stats: AdminStatMock[]
  responseTime: { day: string; value: number }[]
  informationAccuracy: { percentage: number }
  recentActivities: AdminActivityMock[]
  quickActions: AdminQuickActionMock[]
  urgentAlerts: AdminUrgentAlertMock[]
}

export const ADMIN_ALERT_COLORS = {
  critical: '#F44336',
  warning: '#FF9800',
} as const

export const ADMIN_DASHBOARD_MOCK: AdminDashboardMockData = {
  stats: [
    {
      id: 'users',
      title: 'إجمالي المستخدمين',
      value: '14,280',
      icon: 'users',
      valueColor: '#2196F3',
    },
    {
      id: 'volunteers',
      title: 'المتطوعون المتميزون',
      value: '1,402',
      icon: 'userPlus',
      valueColor: '#2196F3',
    },
    {
      id: 'tasks',
      title: 'المهام المنجزة',
      value: '8,921',
      icon: 'checkCircle',
      valueColor: '#2196F3',
    },
    {
      id: 'alerts',
      title: 'التنبيهات النشطة',
      value: '24',
      icon: 'alertTriangle',
      valueColor: '#2196F3',
    },
  ],
  responseTime: [
    { day: 'السبت', value: 42 },
    { day: 'الجمعة', value: 38 },
    { day: 'الخميس', value: 45 },
    { day: 'الأربعاء', value: 36 },
    { day: 'الثلاثاء', value: 40 },
    { day: 'الاثنين', value: 33 },
    { day: 'الأحد', value: 37 },
  ],
  informationAccuracy: { percentage: 96 },
  recentActivities: [
    {
      id: '1',
      title: 'تعديل ساعات الخدمة في مركز الشمال',
      time: 'منذ 10 دقائق',
      icon: 'pencil',
    },
    {
      id: '2',
      title: 'انضمام متطوع جديد إلى فريق الاستجابة',
      time: 'منذ ساعة',
      icon: 'userPlus',
    },
    {
      id: '3',
      title: 'استقبال نداء استغاثة جديد',
      time: 'منذ ساعتين',
      icon: 'alertTriangle',
    },
    {
      id: '4',
      title: 'إرسال تقرير الميدان النهائي',
      time: 'منذ 3 ساعات',
      icon: 'fileText',
    },
  ],
  quickActions: [
    { id: 'volunteers', label: 'إدارة المتطوعين', icon: 'users', href: '/admin/users' },
    { id: 'content', label: 'إدارة المحتوى', icon: 'fileText', href: '/admin/health?tab=content' },
    { id: 'reports', label: 'التقارير', icon: 'barChart', href: '/admin/reports' },
    { id: 'settings', label: 'إعدادات النظام', icon: 'settings', href: '/admin/security' },
  ],
  urgentAlerts: [
    {
      id: '1',
      title: 'طوارئ: مستشفى الأقصى - نقص حاد في مخزون الدم',
      description: 'مطلوب تنسيق فوري مع بنك الدم المركزي',
      time: 'منذ 5 دقائق',
      severity: 'critical',
    },
    {
      id: '2',
      title: 'منطقة الزيتون - قصف جديد، إغلاق الطرق',
      description: 'تحديث مسارات الإخلاء والوصول للفرق الميدانية',
      time: 'منذ 15 دقيقة',
      severity: 'critical',
    },
    {
      id: '3',
      title: 'استغاثة من حي التفاح - عائلة محاصرة',
      description: 'تم تسجيل نداء استغاثة يحتاج متابعة عاجلة',
      time: 'منذ 22 دقيقة',
      severity: 'critical',
    },
  ],
}
