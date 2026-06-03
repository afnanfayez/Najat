import type { AdminMapsDashboard, AdminMapsPackageEditorData } from '@/schemas/adminMaps'

export const ADMIN_MAPS_DASHBOARD: AdminMapsDashboard = {
  sizes: {
    baseMapSizeMb: 242.4,
    differentialDataMb: 2.6,
    changeRateNote: 'معدل التغيير التراكمي منذ الإصدار السابق',
  },
  integrity: {
    activePackage: 'ME-NORTH-2023-V4',
    lastSyncAgo: 'منذ 12 دقيقة',
    inspectionPoints: 1402,
    syncPercent: 98,
    syncSegments: [
      { label: 'مزامنة كاملة', percent: 65, color: '#2196F3' },
      { label: 'تحديث جزئي', percent: 20, color: '#FF9800' },
      { label: 'متبقي', percent: 15, color: '#E8EEF5' },
    ],
  },
  publishLogs: [
    {
      id: '1',
      geographicScope: 'قطاع غزة - شمال',
      publishedAt: '2023-11-20 | 09:45',
      deviceCount: 1240,
      changeImpact: '+12 مسار آمن',
      status: 'published',
      classification: 'safe',
      operationalStatus: 'open',
    },
    {
      id: '2',
      geographicScope: 'المنطقة الوسطى',
      publishedAt: '2023-11-20 | 11:20',
      deviceCount: null,
      changeImpact: 'تحديث إحداثيات المستشفى',
      status: 'processing',
    },
    {
      id: '3',
      geographicScope: 'خانيونس - شرق',
      publishedAt: '2023-11-20 | 11:20',
      deviceCount: 450,
      changeImpact: 'ضبط الحدود',
      status: 'failed',
    },
    {
      id: '4',
      geographicScope: 'رفح - المنطقة الغربية',
      publishedAt: '2023-11-20 | 11:20',
      deviceCount: 2105,
      changeImpact: 'مراكز إخلاء جديدة',
      status: 'published',
    },
  ],
  insights: [
    {
      id: 'layers',
      title: 'سلامة الطبقات',
      description:
        'تم التحقق من سلامة 12 طبقة جغرافية أساسية. لا يوجد تعارض في البيانات.',
    },
    {
      id: 'offline',
      title: 'جاهزية الأوفلاين',
      description:
        'حجم الحزمة المضغوطة الحالية 185 MB. جاهز لبدء التجميع.',
    },
    {
      id: 'coverage',
      title: 'مناطق منخفضة التغطية',
      description:
        'تحذير: 3 مناطق حدودية تعاني من ضعف الاتصال المستمر للمزامنة الحية.',
      variant: 'warning',
    },
  ],
}

export const ADMIN_MAPS_PACKAGE_EDITOR: AdminMapsPackageEditorData = {
  verificationRequests: [
    {
      id: 'v1',
      tag: 'منطقة خطر',
      tagVariant: 'danger',
      title: 'بلاغ عن قصف بالقرب من مستشفى الشفاء',
      description:
        'أبلغ عنه 4 مستخدمين موثوقين في المنطقة المحيطة بالمستشفى، يرجى التحديث فوراً.',
    },
    {
      id: 'v2',
      tag: 'تضرر بنية تحتية',
      tagVariant: 'warning',
      title: 'انقطاع طريق صلاح الدين',
      description:
        'انهيار مبنى سكني أدى إلى إغلاق كلي للمسار الجنوبي عند مفترق نتساريم.',
    },
    {
      id: 'v3',
      tag: 'منطقة خطر',
      tagVariant: 'danger',
      title: 'بلاغ عن قصف بالقرب من مستشفى الشفاء',
      description:
        'أبلغ عنه 4 مستخدمين موثوقين في المنطقة المحيطة بالمستشفى، يرجى التحديث فوراً.',
    },
  ],
  fieldReports: [
    {
      id: 'r1',
      author: 'فريق ألفا',
      time: '١٠:٤٢ ص',
      message: 'وصلنا إلى النقطة ٤، الوضع هادئ والمسار سالك حالياً.',
    },
    {
      id: 'r2',
      author: 'سارة (منسقة)',
      time: '١٠:٣٥ ص',
      message: 'نحتاج لتحديث طبقة المستشفيات في القطاع الغربي فوراً.',
    },
  ],
  quickActions: [
    {
      id: 'a1',
      type: 'update',
      message: 'تحديث: تعديل إحداثيات المسار الآمن (A-2)',
    },
    {
      id: 'a2',
      type: 'delete',
      message: 'حذف: إزالة نقطة تفتيش وهمية',
    },
    {
      id: 'a3',
      type: 'add',
      message: 'إضافة: طبقة مساعدات غذائية جديدة',
    },
  ],
  layers: [
    { id: 'corridors', label: 'الممرات الإنسانية', color: '#2196F3', active: true },
    { id: 'conflict', label: 'مناطق النزاع النشط', color: '#FF9800', active: true },
    { id: 'hospitals', label: 'المستشفيات الميدانية', color: '#EF4444', active: true },
  ],
  integrity: {
    fieldDataAccuracy: 94,
    lastUpdateMinutes: 2,
  },
}
