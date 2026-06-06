import type {
  AdminCommunicationDashboard,
  AdminCommunicationVolunteerOption,
} from '@/schemas/adminCommunication'

export const ADMIN_COMMUNICATION_TABS = [
  { id: 'internal_tasks' as const, label: 'المهام الداخلية' },
  { id: 'strategic_broadcast' as const, label: 'البث الاستراتيجي' },
  { id: 'feedback_analysis' as const, label: 'تحليل الملاحظات' },
]

export const ADMIN_COMMUNICATION_VOLUNTEERS: AdminCommunicationVolunteerOption[] = [
  { id: 'v1', name: 'إسلام أبو منصور' },
  { id: 'v2', name: 'سارة محمود' },
  { id: 'v3', name: 'خالد عمر' },
  { id: 'v4', name: 'نور الدين' },
  { id: 'v5', name: 'ليلى حسن' },
]

export const ADMIN_COMMUNICATION_DASHBOARD: AdminCommunicationDashboard = {
  stats: {
    activeInProgress: 12,
    criticalCases: 4,
    completedLast24h: 28,
  },
  tasks: [
    {
      id: 't1',
      title: 'تحديث بيانات مستشفى الشفاء',
      badgeTone: 'critical',
      badgeLabel: 'شديد الأهمية',
      timeLabel: 'ينتهي خلال 45 دقيقة',
      assigneeName: 'إسلام أبو منصور',
      assigneeRole: 'مدير النظام',
      assigneeAvatar: '/assets/profile.png',
      location: 'المنطقة الشمالية - مركز المدينة',
      region: 'شمال القطاع',
      volunteerId: 'v1',
      priorityLevel: 'urgent',
    },
    {
      id: 't2',
      title: 'تدقيق توزيع المعونات الغذائية',
      badgeTone: 'active',
      badgeLabel: 'نشط',
      timeLabel: 'آخر تحديث قبل 10 دقائق',
      assigneeName: 'إسلام أبو منصور',
      assigneeRole: 'مدير النظام',
      assigneeAvatar: '/assets/profile.png',
      location: 'المنطقة الشمالية - مركز المدينة',
      region: 'شمال القطاع',
      volunteerId: 'v1',
      priorityLevel: 'normal',
    },
    {
      id: 't3',
      title: 'تنسيق نقاط الإغاثة في خانيونس',
      badgeTone: 'active',
      badgeLabel: 'نشط',
      timeLabel: 'آخر تحديث قبل ساعة',
      assigneeName: 'سارة محمود',
      assigneeRole: 'منسق',
      assigneeAvatar: '/assets/profile_avatar.png',
      location: 'خانيونس - الحي الوسط',
      region: 'خانيونس',
      volunteerId: 'v2',
      priorityLevel: 'normal',
    },
    {
      id: 't4',
      title: 'مراجعة تقارير الميدان في رفح',
      badgeTone: 'normal',
      badgeLabel: 'عادي',
      timeLabel: 'ينتهي خلال 3 ساعات',
      assigneeName: 'خالد عمر',
      assigneeRole: 'متطوع',
      assigneeAvatar: '/assets/profile_avatar.png',
      location: 'رفح - المنطقة الشرقية',
      region: 'رفح',
      volunteerId: 'v3',
      priorityLevel: 'low',
    },
  ],
  performanceWeekly: [
    { day: 'السبت', value: 62 },
    { day: 'الأحد', value: 74 },
    { day: 'الاثنين', value: 68 },
    { day: 'الثلاثاء', value: 82 },
    { day: 'الأربعاء', value: 76 },
    { day: 'الخميس', value: 88 },
    { day: 'الجمعة', value: 71 },
  ],
  performanceMonthly: [
    { day: 'الأسبوع 1', value: 70 },
    { day: 'الأسبوع 2', value: 78 },
    { day: 'الأسبوع 3', value: 85 },
    { day: 'الأسبوع 4', value: 80 },
  ],
  systemResilience: {
    statusLabel: 'نشط',
    title: 'مرونة النظام',
    message:
      'تم تعزيز استقرار الخوادم المركزية. وقت الاستجابة الحالي 14ms. جميع بوابات التواصل الميداني مؤمنة بالكامل.',
    lastCheckLabel: 'آخر فحص',
    lastCheckAgo: 'منذ دقيقتين',
  },
}
