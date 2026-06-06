import type {
  AdminDataDashboard,
  AdminDataReviewDetail,
  AdminDataSyncDashboard,
} from '@/schemas/adminData'

export const ADMIN_DATA_DASHBOARD: AdminDataDashboard = {
  stats: {
    pendingReview: 124,
    publishedToday: 42,
    rejectedRequests: 12,
    activeVolunteers: 89,
  },
  requests: [
    {
      id: '1',
      title: 'الاونروا (UNRWA)',
      subtitle: 'UNRWA',
      description:
        'تحديث بيانات مراكز الإيواء والمساعدات الغذائية في مخيم جabaliya. يتضمن 12 موقعاً جديداً.',
      status: 'under_review',
      volunteerName: 'أحمد علي (متطوع)',
      submittedAt: 'تم التقديم: 12 أكتوبر 2023',
      filterTab: 'under_review',
    },
    {
      id: '2',
      title: 'اطباء بلا حدود',
      subtitle: 'Médecins Sans Frontières',
      description:
        'تقرير ميداني عن حالة المستشفى الميداني في خانيونس وتحديث إحداثيات الوصول الطبي.',
      status: 'pending_review',
      volunteerName: 'سارة محمود (متطوعة)',
      submittedAt: 'تم التقديم: 11 أكتوبر 2023',
      filterTab: 'under_review',
    },
    {
      id: '3',
      title: 'مؤسسة واش (WASH)',
      subtitle: 'Water & Sanitation',
      description:
        'بيانات محطات المياه النقالة ونقاط توزيع الصرف الصحي في المنطقة الوسطى.',
      status: 'published',
      volunteerName: 'محمد حسن (متطوع)',
      submittedAt: 'تم التقديم: 10 أكتوبر 2023',
      filterTab: 'published',
    },
    {
      id: '4',
      title: 'الصليب الأحمر',
      subtitle: 'Red Cross',
      description:
        'تحديث قائمة نقاط الإسعاف الأولي والمركبات الطبية المتاحة في رفح.',
      status: 'rejected',
      volunteerName: 'ليلى أبو سالم (متطوعة)',
      submittedAt: 'تم التقديم: 9 أكتوبر 2023',
      filterTab: 'reviewed',
    },
    {
      id: '5',
      title: 'مستشفى الأمل التخصصي',
      subtitle: 'Al-Amal Specialized Hospital',
      description:
        'طلب تحديث شامل لبيانات المنشأة، المخزون الطبي، والخدمات المتاحة في حي اليرموك.',
      status: 'pending_review',
      volunteerName: 'فريق التحقق الميداني',
      submittedAt: 'تم التقديم: 8 أكتوبر 2023',
      filterTab: 'under_review',
    },
    {
      id: '6',
      title: 'برنامج الأغذية العالمي',
      subtitle: 'World Food Programme',
      description:
        'تحديث نقاط توزيع الحصص الغذائية ومواعيد التسليم في شمال قطاع غزة.',
      status: 'published',
      volunteerName: 'خالد نصر (متطوع)',
      submittedAt: 'تم التقديم: 7 أكتوبر 2023',
      filterTab: 'published',
    },
  ],
}

export const ADMIN_DATA_REVIEW_DETAILS: Record<string, AdminDataReviewDetail> = {
  '5': {
    id: '5',
    requestCode: 'REQ-2024-0892',
    title: 'مستشفى الأمل التخصصي',
    submittedAgo: 'تم التقديم منذ ساعتين',
    facilityName: 'مستشفى الأمل التخصصي',
    facilityType: 'مستشفى تخصصي',
    location: 'حي اليرموك، غزة',
    lastFieldUpdate: '24 مايو 2024 - 14:30',
    isOpen: true,
    inventory: [
      { id: 'i1', label: 'المعدات الطبية الأساسية', percent: 85, variant: 'success' },
      { id: 'i2', label: 'المستلزمات الطارئة', percent: 12, variant: 'danger' },
    ],
    services: [
      'طوارئ 24 ساعة',
      'العناية المركزة',
      'مختبر الدم',
      'أشعة X',
      'جراحة عامة',
      'قسم الأطفال',
    ],
    sourceNotes:
      'تم التحقق من البيانات عبر اتصال هاتفي مباشر مع مدير المنشأة (د. أحمد خالد) وزيارة ميدانية سريعة من قبل فريق المسح التطوعي. تظهر الصور المرفقة حالة الأدوية الحرجة التي شارفت على الانتهاء. التنسيق مطلوب مع الهلال الأحمر لتأمين النواقص.',
    auditLog: [
      {
        id: 'a1',
        message: 'تم التحقق من الإحداثيات الجغرافية',
        actor: 'سارة أحمد',
        time: 'منذ 45 دقيقة',
      },
      {
        id: 'a2',
        message: 'تم رفع الصور الميدانية',
        actor: 'فريق ألفا',
        time: 'منذ ساعتين',
      },
    ],
  },
}

export const DEFAULT_ADMIN_DATA_REVIEW = ADMIN_DATA_REVIEW_DETAILS['5']

export const ADMIN_DATA_SYNC_DASHBOARD: AdminDataSyncDashboard = {
  syncStatus: {
    lastSyncAgo: 'منذ 12 دقيقة',
    successRate: 98.4,
    queueCount: 14,
  },
  acceptedRequests: [
    {
      id: 's1',
      code: 'MED-8821',
      location: 'مخيم الزعتري',
      dataType: 'سجلات اللقاحات',
      acceptedAt: 'اليوم 09:45 ص',
      priority: 'very_high',
    },
    {
      id: 's2',
      code: 'NUT-4410',
      location: 'خانيونس',
      dataType: 'مسح التغذية',
      acceptedAt: 'اليوم 08:30 ص',
      priority: 'medium',
    },
    {
      id: 's3',
      code: 'WASH-112',
      location: 'رفح',
      dataType: 'جودة المياه',
      acceptedAt: 'أمس 04:15 م',
      priority: 'low',
    },
  ],
  activityLog: [
    {
      id: 'l1',
      actor: 'سارة أحمد',
      action: 'نشرت بيانات لقاحات زعتري',
      timeAgo: 'منذ 5 دقائق',
    },
    {
      id: 'l2',
      actor: 'النظام الذكي',
      action: 'عدّل أولوية الطلب #MED-8821',
      timeAgo: 'منذ 32 دقيقة',
    },
    {
      id: 'l3',
      actor: 'محمود ياسين',
      action: 'راجع طلب مستشفى الأمل',
      timeAgo: 'منذ 55 دقيقة',
    },
    {
      id: 'l4',
      actor: 'قاعدة البيانات',
      action: 'اكتملت المزامنة الدورية',
      timeAgo: 'منذ ساعة',
    },
  ],
}
