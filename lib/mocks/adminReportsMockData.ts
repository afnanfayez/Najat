import type { AdminReportsDashboard } from '@/schemas/adminReports'

export const ADMIN_REPORTS_TABS = [
  { id: 'statistical' as const, label: 'التقارير الإحصائية' },
  { id: 'operations' as const, label: 'تقارير العمليات' },
]

export const ADMIN_REPORTS_DASHBOARD: AdminReportsDashboard = {
  statistical: {
    kpis: [
      { id: 'k1', label: 'المستشفيات العاملة', value: '14/22', tag: 'نشط' },
      { id: 'k2', label: 'نقاط التوزيع النشطة', value: '38', tag: '+12 جديدة' },
      { id: 'k3', label: 'إجمالي الطرود الغذائية', value: '45,000', tag: 'أسبوعي' },
      { id: 'k4', label: 'المياه الموزعة', value: '120k', tag: 'لتر' },
    ],
    regionalDistribution: {
      title: 'توزيع الطلبات حسب المنطقة',
      subtitle: 'كثافة الطلبات الجغرافية خلال الفترة الحالية',
      periodTag: 'الأسبوع الحالي',
      points: [
        { region: 'الشمالية', value: 82 },
        { region: 'الوسطى', value: 58 },
        { region: 'الجنوبية', value: 45 },
        { region: 'الغربية', value: 76 },
        { region: 'الساحلية', value: 52 },
      ],
    },
    resourceBreakdown: {
      segments: [
        { label: 'أغذية', percent: 55, color: '#2196F3' },
        { label: 'أدوية', percent: 30, color: '#F97316' },
        { label: 'مياه', percent: 15, color: '#EF4444' },
      ],
      totalLabel: 'الإجمالي',
      totalValue: '100',
    },
    responseTime: {
      title: 'متوسط وقت الاستجابة',
      volunteers: [
        { month: 'يناير', value: 68 },
        { month: 'مارس', value: 62 },
        { month: 'مايو', value: 55 },
        { month: 'يوليو', value: 48 },
        { month: 'سبتمبر', value: 58 },
        { month: 'نوفمبر', value: 72 },
      ],
      beneficiaries: [
        { month: 'يناير', value: 74 },
        { month: 'مارس', value: 66 },
        { month: 'مايو', value: 60 },
        { month: 'يوليو', value: 52 },
        { month: 'سبتمبر', value: 64 },
        { month: 'نوفمبر', value: 70 },
      ],
    },
    needyRegions: {
      title: 'أبرز المناطق احتياجاً',
      regions: [
        {
          id: 'r1',
          name: 'المنطقة الوسطى',
          level: 'حرج جداً',
          levelTone: 'critical',
          percent: 92,
        },
        {
          id: 'r2',
          name: 'المنطقة الساحلية',
          level: 'مستقر',
          levelTone: 'stable',
          percent: 58,
        },
        {
          id: 'r3',
          name: 'المنطقة الشمالية',
          level: 'متوسط',
          levelTone: 'medium',
          percent: 72,
        },
      ],
    },
    insight: {
      title: 'ملخص الرؤية التحليلية',
      body: 'يظهر التحليل الإحصائي نمواً مطرداً بنسبة 14% في فعالية توزيع الطرود الغذائية مقارنة بالشهر الماضي. هناك حاجة ملحة لتعزيز الإمدادات الطبية في المنطقة الوسطى لمواكبة زيادة الطلبات بنسبة 22%.',
      actionLabel: 'عرض التفاصيل الإقليمية',
    },
  },
  operations: {
    kpis: [
      { id: 'o1', label: 'المستخدمون النشطون', value: '12,450' },
      { id: 'o2', label: 'المتطوعون الميدانيون', value: '840' },
      { id: 'o3', label: 'المهام المكتملة', value: '2,130' },
      { id: 'o4', label: 'سرعة الاستجابة', value: '3.2 ساعات' },
      { id: 'o5', label: 'دقة البيانات', value: '96%' },
    ],
    activityBreakdown: {
      segments: [
        { label: 'الخدمات الطبية', percent: 45, color: '#2196F3' },
        { label: 'المساعدات الغذائية', percent: 30, color: '#F97316' },
        { label: 'طرق آمنة', percent: 25, color: '#EF4444' },
      ],
      totalLabel: 'الإجمالي',
      totalValue: '100',
    },
    activeRegions: {
      title: 'المناطق الأكثر نشاطاً',
      subtitle: 'توزيع كثافة النشاط حسب الموقع الجغرافي',
      mapActionLabel: 'خريطة كاملة',
      regions: [
        { id: 'a1', name: 'شمال غزة', percent: 85 },
        { id: 'a2', name: 'مدينة غزة', percent: 72 },
        { id: 'a3', name: 'المنطقة الوسطى', percent: 55 },
        { id: 'a4', name: 'خان يونس', percent: 48 },
        { id: 'a5', name: 'رفح', percent: 30 },
      ],
    },
    dataQuality: {
      title: 'تقارير جودة البيانات',
      subtitle: 'التحقق من صحة المدخلات الميدانية',
      gauges: [
        {
          id: 'g1',
          value: 96,
          label: 'دقة البيانات',
          description: 'معدل البيانات التي تم التحقق منها ومطابقتها للمعايير',
          color: '#22C55E',
        },
        {
          id: 'g2',
          value: 80,
          label: 'سرعة التحقق',
          description: 'نسبة التقارير التي يتم التحقق منها في أقل من ٦٠ دقيقة',
          color: '#2196F3',
        },
      ],
    },
  },
}
