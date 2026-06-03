import type { AdminMapsDashboard } from '@/schemas/adminMaps'

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
